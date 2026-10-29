const SESSION_KEY = 'gerireport_session';
const publicUser = ({id,name,email=''}) => ({id,name,email});
// Demo access only: no account registration or password persistence.
export async function authenticateTechnician(username,password){
 const name=String(username||'').trim().replace(/\s+/g,' ');
 if(!name)throw new Error('Escribe tu nombre de usuario.');
 if(name.length>100)throw new Error('El usuario debe tener como máximo 100 caracteres.');
 if(typeof password!=='string'||!password.trim())throw new Error('Escribe una contraseña para ingresar a la demo.');
 return {id:'demo:'+encodeURIComponent(name.toLocaleLowerCase('es')),name,email:name.includes('@')?name:''};
}
export function readSession(){
 for(const storage of [globalThis.sessionStorage,globalThis.localStorage]){
  try{const saved=JSON.parse(storage?.getItem(SESSION_KEY)||'null');if(typeof saved?.id==='string'&&typeof saved.name==='string'&&saved.name.trim())return publicUser(saved);}catch{}
 }
 return null;
}
export function saveSession(user,remember){
 clearSession();
 const storage=remember?localStorage:sessionStorage;
 storage.setItem(SESSION_KEY,JSON.stringify(publicUser(user)));
}
export function clearSession(){
 globalThis.localStorage?.removeItem(SESSION_KEY);
 globalThis.sessionStorage?.removeItem(SESSION_KEY);
}
