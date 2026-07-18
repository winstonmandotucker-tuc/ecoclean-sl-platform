import { api } from './api';

let cache = new Map<string,string>();
let loaded = false;

export const operationalStore = {
  async load() {
    const { data } = await api<{data:Record<string,unknown>}>('/operational-state');
    cache = new Map(Object.entries(data).map(([key,value]) => [key,typeof value === 'string' ? value : JSON.stringify(value)]));
    loaded = true;
  },
  getItem(key:string) {
    return cache.get(key) ?? null;
  },
  setItem(key:string,value:string) {
    cache.set(key,value);
    if (loaded) void api<void>(`/operational-state/${encodeURIComponent(key)}`,{method:'PUT',body:JSON.stringify({value})}).catch(error=>console.error('Operational state persistence failed',error));
  },
  removeItem(key:string) {
    cache.delete(key);
    if (loaded) void api<void>(`/operational-state/${encodeURIComponent(key)}`,{method:'DELETE'}).catch(error=>console.error('Operational state removal failed',error));
  },
  clearMemory() { cache.clear(); loaded=false; },
};
