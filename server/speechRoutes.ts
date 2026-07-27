import crypto from 'node:crypto';
import {Router} from 'express';
import multer from 'multer';
import {z} from 'zod';
import {authenticate} from './auth.js';
import {config} from './config.js';
import {pool} from './db.js';

export const speechRoutes=Router();
speechRoutes.use(authenticate);
const audioUpload=multer({storage:multer.memoryStorage(),limits:{fileSize:10*1024*1024,files:1}});
const languages={en:'English',kri:'Krio',tem:'Temne',men:'Mende'} as const;
const providerReady=()=>config.speech.provider==='openai'&&Boolean(config.speech.apiKey);
const audit=(userId:number,action:string,req:any,entityId?:number,metadata?:unknown)=>pool.query('INSERT INTO audit_logs(user_id,action,entity_type,entity_id,ip_address,metadata_json) VALUES(?,?,?,?,?,?)',[userId,action,'speech_job',entityId||null,req.ip,metadata?JSON.stringify(metadata):null]);

speechRoutes.get('/speech/capabilities',(_req,res)=>res.json({data:{enabled:providerReady(),provider:config.speech.provider==='openai'?'ECOCLEAN managed speech adapter':'not configured',languages:Object.entries(languages).map(([code,name])=>({code,name})),maxSeconds:60,maxBytes:10*1024*1024,audioRetention:'Audio is processed in memory and is not retained by ECOCLEAN.'}}));

speechRoutes.post('/speech/transcribe',audioUpload.single('audio'),async(req,res)=>{
  const parsed=z.object({language:z.enum(['en','kri','tem','men']),consent:z.literal('true')}).safeParse(req.body);
  if(!parsed.success||!req.file)return res.status(422).json({error:'Choose a supported language, consent to processing, and record an audio message.'});
  if(!['audio/webm','audio/ogg','audio/wav','audio/x-wav','audio/mpeg','audio/mp4','audio/aac'].includes(req.file.mimetype))return res.status(422).json({error:'Unsupported audio format.'});
  if(!providerReady())return res.status(503).json({error:'Voice transcription is installed but the production speech provider is not configured.'});
  const [created]=await pool.query<any>("INSERT INTO speech_jobs(user_id,operation,source_language,target_language,provider,model_name,consent_at,metadata_json) VALUES(?,'transcription',?,?,?,?,NOW(),?)",[req.authUser!.id,parsed.data.language,parsed.data.language==='en'?null:'en',config.speech.provider,config.speech.transcriptionModel,JSON.stringify({mimeType:req.file.mimetype,size:req.file.size,audioRetained:false,requestId:crypto.randomUUID()})]);
  const id=created.insertId;
  try{
    const makeForm=(model:string,translate=false)=>{const form=new FormData();form.append('file',new Blob([req.file!.buffer],{type:req.file!.mimetype}),req.file!.originalname||'recording.webm');form.append('model',model);form.append('response_format','json');if(!translate&&parsed.data.language==='en')form.append('language','en');return form;};
    const call=async(path:string,form:FormData)=>{const response=await fetch(`${config.speech.baseUrl}${path}`,{method:'POST',headers:{Authorization:`Bearer ${config.speech.apiKey}`},body:form});const data:any=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data?.error?.message||`Speech provider returned ${response.status}.`);return String(data.text||'').trim();};
    const original=await call('/audio/transcriptions',makeForm(config.speech.transcriptionModel));
    const translated=parsed.data.language==='en'?original:await call('/audio/translations',makeForm(config.speech.translationModel,true));
    await pool.query("UPDATE speech_jobs SET status='completed',original_transcript=?,translated_text=?,completed_at=NOW() WHERE id=?",[original,translated,id]);
    await audit(req.authUser!.id,'speech.transcribed',req,id,{language:parsed.data.language,audioRetained:false});
    res.status(201).json({data:{id,language:parsed.data.language,languageName:languages[parsed.data.language],originalTranscript:original,englishTranslation:translated,requiresConfirmation:true}});
  }catch(error:any){await pool.query("UPDATE speech_jobs SET status='failed',error_code=?,completed_at=NOW() WHERE id=?",[String(error?.message||'provider_error').slice(0,100),id]);await audit(req.authUser!.id,'speech.failed',req,id,{language:parsed.data.language});res.status(502).json({error:'The voice recording could not be transcribed. Please retry or type the message.',detail:config.env==='production'?undefined:error?.message});}
});

speechRoutes.post('/speech/jobs/:id/confirm',async(req,res)=>{const [result]=await pool.query<any>("UPDATE speech_jobs SET user_confirmed_at=NOW() WHERE id=? AND user_id=? AND status='completed'",[req.params.id,req.authUser!.id]);if(!result.affectedRows)return res.status(404).json({error:'Speech result not found.'});await audit(req.authUser!.id,'speech.confirmed',req,Number(req.params.id));res.status(204).end();});

speechRoutes.post('/speech/synthesize',async(req,res)=>{
  const parsed=z.object({text:z.string().trim().min(1).max(2000),language:z.enum(['en','kri','tem','men']).default('en'),consent:z.literal(true)}).safeParse(req.body);
  if(!parsed.success)return res.status(422).json({error:'Text, language, and processing consent are required.'});
  if(!providerReady())return res.status(503).json({error:'Cloud speech is unavailable. Use the device playback option where supported.'});
  const [created]=await pool.query<any>("INSERT INTO speech_jobs(user_id,operation,source_language,provider,model_name,status,consent_at,metadata_json) VALUES(?,'synthesis',?,?,?,'processing',NOW(),?)",[req.authUser!.id,parsed.data.language,config.speech.provider,config.speech.synthesisModel,JSON.stringify({textLength:parsed.data.text.length,audioRetained:false})]);
  try{const response=await fetch(`${config.speech.baseUrl}/audio/speech`,{method:'POST',headers:{Authorization:`Bearer ${config.speech.apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:config.speech.synthesisModel,voice:config.speech.voice,input:parsed.data.text,response_format:'mp3',instructions:`Read clearly and respectfully. The requested language is ${languages[parsed.data.language]}.`})});if(!response.ok)throw new Error('provider_error');const bytes=Buffer.from(await response.arrayBuffer());await pool.query("UPDATE speech_jobs SET status='completed',completed_at=NOW() WHERE id=?",[created.insertId]);await audit(req.authUser!.id,'speech.synthesized',req,created.insertId,{language:parsed.data.language,audioRetained:false});res.setHeader('Cache-Control','no-store');res.type('audio/mpeg').send(bytes);}catch{await pool.query("UPDATE speech_jobs SET status='failed',error_code='provider_error',completed_at=NOW() WHERE id=?",[created.insertId]);res.status(502).json({error:'Audio playback could not be generated.'});}
});
