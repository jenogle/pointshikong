import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {createClient} from '@supabase/supabase-js';
import {CalendarDays,CheckCircle2,ChevronRight,ClipboardList,LogIn,LogOut,Search,ShieldCheck,Users} from 'lucide-react';
import './styles.css';

const SUPABASE_URL='https://bzgqlykqaqzolymnctkz.supabase.co';
const SUPABASE_KEY='sb_publishable_sUEWU4fzZCrPcnuf3nQTuQ_0frTg7wC';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);

const empty={event_date:'',email:'',consent_personal_data:false,full_name:'',nickname:'',phone:'',joined_official_line:false};

function PublicForm(){
 const [form,setForm]=useState(empty),[busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 const set=(k,v)=>setForm(s=>({...s,[k]:v}));
 const submit=async(e)=>{e.preventDefault();setError(''); if(!form.consent_personal_data)return setError('請先同意個人資料蒐集與使用。'); setBusy(true);
  const {error}=await supabase.from('registrations').insert({...form,form_data:{}});setBusy(false); if(error)return setError(error.message); setDone(true);setForm(empty);
 };
 if(done)return <main className="publicShell"><section className="successCard"><CheckCircle2 size={58}/><h1>報名資料已送出</h1><p>我們已收到你的報名資料，後續資訊將依活動流程通知。</p><button onClick={()=>setDone(false)}>再填一份報名</button></section></main>;
 return <main className="publicShell"><section className="hero"><span className="eyebrow">POINT SHIKONG EVENT</span><h1>活動報名</h1><p>請完整填寫以下資料，送出後即完成報名資料登記。</p></section>
 <form className="formCard" onSubmit={submit}>
  <Field label="比賽日期 / 場次" required><input value={form.event_date} onChange={e=>set('event_date',e.target.value)} placeholder="例如：9/5 台北場" required/></Field>
  <Field label="Email"><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="name@example.com"/></Field>
  <Field label="實名" required><input value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="請填寫真實姓名" required/></Field>
  <Field label="暱稱" required><input value={form.nickname} onChange={e=>set('nickname',e.target.value)} placeholder="比賽或社群使用暱稱" required/></Field>
  <Field label="電話" required><input inputMode="tel" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="09xxxxxxxx" required/></Field>
  <Field label="是否已加入官方 LINE？" required><div className="choices"><Choice onClick={()=>set('joined_official_line',true)} active={form.joined_official_line===true}>已加入</Choice><Choice onClick={()=>set('joined_official_line',false)} active={form.joined_official_line===false}>尚未加入</Choice></div></Field>
  <label className="consent"><input type="checkbox" checked={form.consent_personal_data} onChange={e=>set('consent_personal_data',e.target.checked)}/><span>我同意主辦方於活動報名、聯繫與相關行政用途內蒐集與使用上述個人資料。</span></label>
  {error&&<div className="error">{error}</div>}<button className="primary" disabled={busy}>{busy?'送出中…':'送出報名'}<ChevronRight size={18}/></button>
 </form><a className="adminLink" href="/admin">管理後台</a></main>;
}
function Field({label,required,children}){return <label className="field"><span>{label}{required&&<b>*</b>}</span>{children}</label>}
function Choice({active,onClick,children}){return <button type="button" className={'choice '+(active?'active':'')} onClick={onClick}>{children}</button>}

function Admin(){
 const [claims,setClaims]=useState(null),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[rows,setRows]=useState([]),[loading,setLoading]=useState(true),[search,setSearch]=useState(''),[error,setError]=useState('');
 const loadAuth=async()=>{const {data}=await supabase.auth.getClaims();setClaims(data?.claims||null);setLoading(false)};
 const loadRows=async()=>{const {data,error}=await supabase.from('registrations').select('*').order('created_at',{ascending:false}); if(error)setError('此帳號尚未被授權為管理員，或讀取失敗：'+error.message); else setRows(data||[])};
 useEffect(()=>{loadAuth(); const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>loadAuth());return()=>subscription.unsubscribe()},[]);
 useEffect(()=>{if(claims)loadRows()},[claims]);
 const login=async(e)=>{e.preventDefault();setError('');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)setError(error.message)};
 const logout=()=>supabase.auth.signOut();
 const changeStatus=async(id,status)=>{const {error}=await supabase.from('registrations').update({status}).eq('id',id);if(!error)setRows(r=>r.map(x=>x.id===id?{...x,status}:x));else setError(error.message)};
 const filtered=useMemo(()=>rows.filter(r=>[r.full_name,r.nickname,r.phone,r.email,r.event_date,r.status].join(' ').toLowerCase().includes(search.toLowerCase())),[rows,search]);
 if(loading)return <div className="adminShell"><div className="loading">讀取中…</div></div>;
 if(!claims)return <main className="adminShell"><form className="loginCard" onSubmit={login}><ShieldCheck size={42}/><h1>管理後台</h1><p>請使用 Supabase 管理員帳號登入。</p><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>{error&&<div className="error">{error}</div>}<button className="primary"><LogIn size={18}/>登入</button><a href="/">回前台</a></form></main>;
 return <main className="adminShell"><header className="adminHeader"><div><span>POINT SHIKONG</span><h1>報名管理</h1></div><button onClick={logout}><LogOut size={17}/>登出</button></header>
 <section className="stats"><Stat icon={<Users/>} value={rows.length} label="總報名數"/><Stat icon={<CheckCircle2/>} value={rows.filter(r=>r.status==='confirmed').length} label="已確認"/><Stat icon={<CalendarDays/>} value={new Set(rows.map(r=>r.event_date)).size} label="活動場次"/></section>
 <section className="adminPanel"><div className="toolbar"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋姓名、暱稱、電話、Email、場次…"/></div><button onClick={loadRows}>重新整理</button></div>{error&&<div className="error">{error}</div>}
 <div className="tableWrap"><table><thead><tr><th>送出時間</th><th>場次</th><th>姓名 / 暱稱</th><th>聯絡方式</th><th>LINE</th><th>狀態</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString('zh-TW')}</td><td>{r.event_date}</td><td><strong>{r.full_name}</strong><small>{r.nickname}</small></td><td>{r.phone}<small>{r.email||'—'}</small></td><td>{r.joined_official_line?'已加入':'未加入'}</td><td><select value={r.status} onChange={e=>changeStatus(r.id,e.target.value)}><option value="new">新報名</option><option value="contacted">已聯繫</option><option value="confirmed">已確認</option><option value="waitlist">候補</option><option value="cancelled">取消</option></select></td></tr>)}</tbody></table>{!filtered.length&&<div className="empty"><ClipboardList/>目前沒有符合的報名資料</div>}</div></section></main>;
}
function Stat({icon,value,label}){return <div className="stat">{icon}<div><strong>{value}</strong><span>{label}</span></div></div>}
function App(){return location.pathname.startsWith('/admin')?<Admin/>:<PublicForm/>}
createRoot(document.getElementById('root')).render(<App/>);
