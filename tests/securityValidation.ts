import assert from 'node:assert/strict';

const base=process.env.TEST_API_URL||'http://127.0.0.1:4000/api';
const password=process.env.TEST_PASSWORD||'Demo@2026!';
async function login(email:string,passwordValue=password){return fetch(`${base}/auth/login`,{method:'POST',headers:{'content-type':'application/json','origin':'http://127.0.0.1:3000'},body:JSON.stringify({email,password:passwordValue})});}
const evidence:Array<Record<string,unknown>>=[];
const unauth=await fetch(`${base}/operations/health`);evidence.push({test:'unauthenticated privileged endpoint',status:unauth.status});assert.equal(unauth.status,401);
const citizenLogin=await login('citizen@ecoclean.sl');assert.equal(citizenLogin.status,200);const citizenCookie=citizenLogin.headers.get('set-cookie')!.split(';')[0];
const rbac=await fetch(`${base}/security/events`,{headers:{cookie:citizenCookie}});evidence.push({test:'Citizen RBAC denial',status:rbac.status});assert.equal(rbac.status,403);
const tampered=await fetch(`${base}/auth/me`,{headers:{cookie:'ecoclean_session=invalid.jwt.signature'}});evidence.push({test:'tampered JWT rejection',status:tampered.status});assert.equal(tampered.status,401);
const injection=await login("admin@ecoclean.sl' OR 1=1 --",'irrelevant');evidence.push({test:'SQL injection-shaped login input',status:injection.status});assert.ok([401,422].includes(injection.status));
const invalidJson=await fetch(`${base}/auth/login`,{method:'POST',headers:{'content-type':'application/json'},body:'{"email":'});const invalidJsonBody=await invalidJson.json();evidence.push({test:'malformed JSON rejection',status:invalidJson.status,body:invalidJsonBody});assert.equal(invalidJson.status,400);assert.equal(invalidJsonBody.error,'Malformed JSON request.');
const traversal=await fetch(`${base}/uploads/../../.env`,{headers:{cookie:citizenCookie}});evidence.push({test:'path traversal request',status:traversal.status});assert.equal(traversal.status,404);
const cors=await fetch(`${base}/health`,{headers:{origin:'https://untrusted.invalid'}});evidence.push({test:'untrusted CORS origin',allowOrigin:cors.headers.get('access-control-allow-origin')});assert.notEqual(cors.headers.get('access-control-allow-origin'),'https://untrusted.invalid');
const headers=await fetch(`${base}/health`);const securityHeaders={contentSecurityPolicy:headers.headers.has('content-security-policy'),frameOptions:headers.headers.get('x-frame-options'),contentTypeOptions:headers.headers.get('x-content-type-options'),requestId:headers.headers.has('x-request-id'),poweredBy:headers.headers.get('x-powered-by')};evidence.push({test:'security headers',...securityHeaders});assert.equal(securityHeaders.contentSecurityPolicy,true);assert.equal(securityHeaders.contentTypeOptions,'nosniff');assert.equal(securityHeaders.poweredBy,null);
console.log(JSON.stringify({testedAt:new Date().toISOString(),evidence},null,2));
