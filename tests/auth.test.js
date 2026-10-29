import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authenticateTechnician,readSession,saveSession,clearSession} from '../src/auth.js';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};};
test('demo accepts an unregistered username with any nonempty password',async()=>{
 globalThis.localStorage=memory();globalThis.sessionStorage=memory();
 const user=await authenticateTechnician('  Ana   Martínez  ','123');
 assert.equal(user.name,'Ana Martínez');
 assert.deepEqual(await authenticateTechnician('Ana Martínez','otra contraseña'),user);
 assert.equal(localStorage.getItem('gerireport_users'),null);
 await assert.rejects(authenticateTechnician('  ','123'),/usuario/);
 await assert.rejects(authenticateTechnician('Ana','  '),/contraseña/);
 saveSession(user,false);assert.deepEqual(readSession(),user);assert.equal(localStorage.getItem('gerireport_session'),null);
 assert.ok(!sessionStorage.getItem('gerireport_session').includes('123'));
 clearSession();assert.equal(readSession(),null);
 const another=await authenticateTechnician('Luis Pérez','demo');saveSession(another,true);
 assert.deepEqual(readSession(),another);assert.equal(sessionStorage.getItem('gerireport_session'),null);
 clearSession();assert.equal(readSession(),null);
});
