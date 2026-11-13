"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY, defaultSettings, type Settings } from "@/lib/site";
const db = createClient(SUPABASE_URL, SUPABASE_KEY);
type Message = { id: string; created_at: string; name: string; email: string; subject: string; message: string; status: string };
export default function ContactInbox() {
 const [messages,setMessages]=useState<Message[]>([]),[settings,setSettings]=useState<Settings|null>(null),[error,setError]=useState(""),[saved,setSaved]=useState("");
 const load=useCallback(async()=>{const {data,error}=await db.from("contact_messages").select("id,created_at,name,email,subject,message,status").order("created_at",{ascending:false}).limit(100);if(error)setError(error.message);else setMessages(data||[]);},[]);
 useEffect(()=>{load();db.from("settings").select("value").eq("key","site").maybeSingle().then(({data})=>setSettings({...defaultSettings,...(data?.value||{})}));},[load]);
 async function save(){if(!settings)return;setError("");const {error}=await db.from("settings").upsert({key:"site",value:settings});if(error)setError(error.message);else {setSaved("Contact settings saved.");const {data}=await db.auth.getSession();await fetch("/api/revalidate",{method:"POST",headers:{Authorization:"Bearer "+(data.session?.access_token||"")}});}}
 async function remove(id:string){
  if(!window.confirm("Permanently delete this message? This cannot be undone."))return;
  setError("");
  const {data,error}=await db.from("contact_messages").delete().eq("id",id).select("id");
  if(error){setError("Could not delete message: "+error.message);return;}
  if(!data?.length){setError("Message was not deleted. Please check admin permissions.");return;}
  setMessages(previous=>previous.filter(message=>message.id!==id));
 }
 async function change(id:string,status:string){const {error}=await db.from("contact_messages").update({status}).eq("id",id);if(error)setError(error.message);else load();}
 return <div className="space-y-8">
 <section className="space-y-4 rounded-2xl bg-white p-6"><h2 className="text-2xl font-semibold">Contact page editor</h2>
 {settings ? <>{([["contactHeading","Page heading"],["contactIntro","Introduction"],["contactSubjects","Inquiry subjects (one per line)"],["contactPublicEmail","Public email (optional)"],["contactTelegram","Telegram (optional)"],["contactWhatsapp","WhatsApp (optional)"],["contactResponseTime","Response-time note (optional)"]] as const).map(([key,title])=><label key={key} className="block space-y-1"><span className="font-semibold">{title}</span>{key==="contactIntro"||key==="contactSubjects"?<textarea rows={key==="contactSubjects"?8:3} className="field" value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/>:<input className="field" value={settings[key]} onChange={e=>setSettings({...settings,[key]:e.target.value})}/>}</label>)}<button className="btn btn-solid" onClick={save}>Save contact settings</button>{saved&&<p>{saved}</p>}</>:<p>Loading settings...</p>}</section>
 <section className="space-y-4"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Private inbox ({messages.length})</h2><button className="btn btn-line" onClick={load}>Refresh</button></div>{error&&<p role="alert" className="text-red-700">{error}</p>}
 {messages.map(m=><article key={m.id} className="rounded-2xl border border-navy-800/10 bg-white p-5"><p className="text-xs text-navy-700">{new Date(m.created_at).toLocaleString()} · {m.status}</p><h3 className="mt-1 text-lg font-bold">{m.subject}</h3><p className="text-sm">{m.name} · {m.email}</p><p className="mt-3 whitespace-pre-wrap break-words">{m.message}</p><div className="mt-3 flex gap-2"><button className="btn btn-line" onClick={()=>change(m.id,"read")}>Mark read</button><button className="btn btn-line" onClick={()=>change(m.id,"archived")}>Archive</button><button className="btn btn-line text-red-700" onClick={()=>remove(m.id)}>Delete</button></div></article>)}{!messages.length&&!error&&<p>No messages yet.</p>}</section></div>;
}
