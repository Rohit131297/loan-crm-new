import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import './style.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tmnxmecjyfstryvorzsm.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const empty = {name:'', mobile:'', email:'', loan_type:'Home Loan', loan_amount:'', banker_name:'', connector_name:'', application_number:'', loan_account_number:'', status:'New', remark:''};

function App(){
  const [leads,setLeads]=useState([]); const [form,setForm]=useState(empty); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false); const [search,setSearch]=useState('');
  const load=async()=>{ if(!SUPABASE_KEY){setMsg('Add VITE_SUPABASE_PUBLISHABLE_KEY to connect Supabase.');return;} const {data,error}=await supabase.from('leads').select('*').order('created_at',{ascending:false}); if(error)setMsg(error.message); else setLeads(data||[]); };
  useEffect(()=>{load()},[]);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const save=async e=>{e.preventDefault();setLoading(true);setMsg(''); const payload={...form,loan_amount:form.loan_amount?Number(form.loan_amount):null}; const {error}=await supabase.from('leads').insert(payload); if(error)setMsg(error.message); else {setMsg('Lead saved successfully in Supabase.');setForm(empty);load();} setLoading(false)};
  const filtered=leads.filter(x=>Object.values(x).join(' ').toLowerCase().includes(search.toLowerCase()));
  return <div className="app"><aside><h1>Loan CRM</h1><p>New independent CRM</p><div className="nav active">Dashboard</div><div className="nav">Leads</div><div className="nav">Payouts</div></aside><main><header><div><h2>Dashboard</h2><span>Supabase connected database</span></div></header><section className="cards"><Card n={leads.length} t="Total Leads"/><Card n={leads.filter(x=>x.status==='Login').length} t="Login"/><Card n={leads.filter(x=>x.status==='Sanction').length} t="Sanction"/><Card n={leads.filter(x=>x.status==='Disbursed').length} t="Disbursed"/></section><div className="grid"><section className="panel"><h3>New Lead</h3><form onSubmit={save}>{[['name','Customer Name'],['mobile','Mobile Number'],['email','Email'],['loan_amount','Loan Amount'],['banker_name','Banker Name'],['connector_name','Connector Name'],['application_number','Application Number'],['loan_account_number','Loan Account Number']].map(([n,l])=><label key={n}>{l}<input name={n} value={form[n]} onChange={change} required={n==='name'||n==='mobile'||n==='loan_amount'}/></label>)}<label>Loan Type<select name="loan_type" value={form.loan_type} onChange={change}><option>Home Loan</option><option>Personal Loan</option><option>Business Loan</option><option>Car Loan</option></select></label><label>Status<select name="status" value={form.status} onChange={change}>{['New','Login','Sanction','Disbursed','Rejected'].map(s=><option key={s}>{s}</option>)}</select></label><label>Remark<textarea name="remark" value={form.remark} onChange={change}/></label><button disabled={loading}>{loading?'Saving...':'Save Lead'}</button></form>{msg&&<div className="msg">{msg}</div>}</section><section className="panel"><div className="row"><h3>Recent Leads</h3><input className="search" placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="table"><div className="tr th"><b>Name</b><b>Mobile</b><b>Loan Amount</b><b>Status</b></div>{filtered.map((x,i)=><div className="tr" key={x.id||i}><span>{x.name||'-'}</span><span>{x.mobile||'-'}</span><span>{x.loan_amount??'-'}</span><span className="badge">{x.status||'-'}</span></div>)}{!filtered.length&&<p className="empty">No leads found.</p>}</div></section></div></main></div>
}
const Card=({n,t})=><div className="card"><strong>{n}</strong><span>{t}</span></div>;
createRoot(document.getElementById('root')).render(<App/>);
