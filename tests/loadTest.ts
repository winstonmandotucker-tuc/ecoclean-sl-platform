import assert from 'node:assert/strict';

const base=process.env.TEST_API_URL||'http://127.0.0.1:4000/api';
const response=await fetch(`${base}/auth/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'admin@ecoclean.sl',password:process.env.TEST_PASSWORD||'Demo@2026!'})});
assert.equal(response.status,200,'Load-test login failed');
const cookie=response.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie);
const endpoints=['/health','/dashboard','/gis/reports','/notifications','/campaigns','/community/posts'];

async function stage(requests:number,concurrency:number){
  let cursor=0,passed=0,failed=0;const latencies:number[]=[];const started=performance.now();
  async function worker(){while(true){const index=cursor++;if(index>=requests)return;const requestStarted=performance.now();try{const result=await fetch(`${base}${endpoints[index%endpoints.length]}`,{headers:{cookie}});latencies.push(performance.now()-requestStarted);if(result.ok)passed++;else failed++;await result.arrayBuffer();}catch{failed++;}}}
  await Promise.all(Array.from({length:concurrency},worker));latencies.sort((a,b)=>a-b);const duration=performance.now()-started;const percentile=(value:number)=>Number((latencies[Math.min(latencies.length-1,Math.floor(latencies.length*value))]||0).toFixed(2));return{requests,concurrency,passed,failed,durationMs:Number(duration.toFixed(2)),requestsPerSecond:Number((requests/(duration/1000)).toFixed(2)),latencyMs:{p50:percentile(.5),p95:percentile(.95),p99:percentile(.99),max:Number((latencies.at(-1)||0).toFixed(2))}};
}

const certification=process.argv.includes('--certification');
const stages:ReadonlyArray<readonly [number,number]>=certification?[[10000,100],[25000,150],[50000,200]]:[[1000,25],[5000,50],[10000,100]];
const results=[];for(const [requests,concurrency] of stages)results.push(await stage(requests,concurrency));
console.log(JSON.stringify({testedAt:new Date().toISOString(),base,results},null,2));
if(results.some(result=>result.failed>0))process.exitCode=1;
