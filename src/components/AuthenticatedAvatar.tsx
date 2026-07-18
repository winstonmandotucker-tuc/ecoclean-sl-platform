import React from 'react';
import type { User } from '../types';
import { mediaUrl } from '../lib/api';

export default function AuthenticatedAvatar({user,className='w-10 h-10',textClassName='text-sm'}:{user:User|null|undefined;className?:string;textClassName?:string}){
  const photo=mediaUrl(user?.profileImageUrl);const initial=user?.fullName?.trim().charAt(0).toUpperCase()||'?';
  return <div className={`${className} rounded-full overflow-hidden bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center shrink-0 font-black`} aria-label={user?.fullName?`${user.fullName} profile photo`:'Authenticated user profile'}>{photo?<img src={photo} alt={`${user?.fullName||'User'} profile`} className="w-full h-full object-cover"/>:<span className={textClassName}>{initial}</span>}</div>;
}
