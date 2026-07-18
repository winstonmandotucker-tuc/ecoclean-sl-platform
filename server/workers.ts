import { runScheduledBackups, enforceRetention } from './backup.js';
import { config } from './config.js';
import { pool } from './db.js';
import { processNotificationQueue } from './notificationProviders.js';
import { processUploadScans } from './uploadScanner.js';

let running=false;
export async function runMaintenanceCycle(){
  if(running)return{skipped:true};
  running=true;
  const started=Date.now();
  try{
    const [notifications,uploads,backups,expired]=await Promise.all([
      processNotificationQueue(50),processUploadScans(50),runScheduledBackups(),enforceRetention(),
    ]);
    await pool.query("INSERT INTO system_metrics(metric_name,metric_value,unit) VALUES('worker.duration',?,'ms')",[Date.now()-started]);
    return{skipped:false,notifications,uploads,backups:backups.length,expired};
  }catch(error){
    await pool.query("INSERT INTO structured_logs(log_level,log_type,message,context_json) VALUES('error','worker','Maintenance cycle failed',?)",[JSON.stringify({error:error instanceof Error?error.message:'Unknown worker error'})]).catch(()=>undefined);
    throw error;
  }finally{running=false;}
}

export function startWorkers(){
  if(!config.workersEnabled)return null;
  void runMaintenanceCycle().catch(()=>undefined);
  const timer=setInterval(()=>void runMaintenanceCycle().catch(()=>undefined),config.workerIntervalMs);
  timer.unref();
  return timer;
}
