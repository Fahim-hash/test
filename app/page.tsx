'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, LogOut, RotateCcw, Users, Wifi, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Color = 'crimson' | 'ocean' | 'forest' | 'amber';
type Kind = 'number' | 'wildColor' | 'wildNumber' | 'chainSplit' | 'linkLock' | 'reverse' | 'overload' | 'purge' | 'snatch';
type Card = { id:string; color?:Color; value?:number; dir?:'up'|'any'|'down'; kind:Kind; label:string };
type Player = { id:string; name:string; hand:Card[]; connected:boolean };
type Game = { players:Player[]; deck:Card[]; chains:Card[][]; activeHead:number; turn:number; turnDir:1|-1; winner:string|null; log:string[]; locked:boolean };

const COLORS:Color[]=['crimson','ocean','forest','amber'];
const COLOR_HEX:Record<Color,string>={crimson:'#ed123f',ocean:'#056080',forest:'#218b1f',amber:'#ffbd59'};
const COLOR_NAME:Record<Color,string>={crimson:'CRIMSON RED',ocean:'OCEAN BLUE',forest:'FOREST GREEN',amber:'AMBER YELLOW'};

function uid(){return Math.random().toString(36).slice(2,10)}
function shuffle<T>(a:T[]){return [...a].sort(()=>Math.random()-.5)}
function makeDeck(){
 const d:Card[]=[];
 for(const color of COLORS) for(let n=1;n<=12;n++) d.push({id:uid(),color,value:n,dir:n<=4?'up':n<=8?'any':'down',kind:'number',label:String(n)});
 for(let i=0;i<2;i++){d.push({id:uid(),kind:'wildColor',label:'COLOR SHIFT'});d.push({id:uid(),kind:'wildNumber',label:'NUMBER SHIFT'})}
 const add=(kind:Kind,label:string,n:number)=>{for(let i=0;i<n;i++)d.push({id:uid(),kind,label})};
 add('chainSplit','CHAIN SPLIT',5);add('linkLock','LINK LOCK',5);add('reverse','REVERSE CURRENT',5);add('overload','OVERLOAD',5);add('purge','PURGE',4);add('snatch','SNATCH',4);
 return shuffle(d);
}
function starter(){return makeDeck().find(c=>c.kind==='number')!}
function canPlay(card:Card, top?:Card){
 if(!top) return true;
 if(card.kind==='purge'||card.kind==='snatch'||card.kind==='chainSplit'||card.kind==='linkLock'||card.kind==='reverse'||card.kind==='overload'||card.kind==='wildColor'||card.kind==='wildNumber') return true;
 if(top.kind!=='number') return true;
 return card.color===top.color && (top.dir==='any'||card.dir==='any'||card.value===top.value || (top.dir==='up'&&card.value>top.value)||(top.dir==='down'&&card.value<top.value));
}
function CardView({card,onClick,selected=false,small=false,back=false}:{card:Card;onClick?:()=>void;selected?:boolean;small?:boolean;back?:boolean}){
 if(back) return <div className={`kx-card back ${small?'small':''}`}><b>K</b><span>KINETIX</span></div>;
 const accent=card.color?COLOR_HEX[card.color]:'#f5f1e8';
 return <button onClick={onClick} className={`kx-card ${card.color||'black'} ${selected?'selected':''} ${small?'small':''}`} style={{'--accent':accent} as React.CSSProperties}>
   <span className="corner">{card.value??'✦'}</span><span className="micro">KX / {card.kind.replace(/([A-Z])/g,' $1').toUpperCase()}</span>
   <span className={`glyph ${card.kind}`}>{card.kind==='number'?card.value:card.kind==='reverse'?'↔':card.kind==='overload'?'±':card.kind==='purge'?'⌁':card.kind==='snatch'?'♧':card.kind==='chainSplit'?'÷':card.kind==='linkLock'?'▣':card.kind==='wildColor'?'◌':'↕'}</span>
   <strong>{card.kind==='number'?card.value:card.label}</strong><small>{card.kind==='number'?card.dir==='up'?'▲ UP':card.dir==='down'?'▼ DOWN':'= ANY':'ACTION CARD'}</small>
 </button>
}

function initialGame(name:string):Game{const deck=makeDeck(); const hand=deck.splice(0,5); const first=starter(); const idx=deck.findIndex(c=>c.id===first.id);if(idx>=0)deck.splice(idx,1);return {players:[{id:uid(),name,hand,connected:true}],deck,chains:[[first]],activeHead:0,turn:0,turnDir:1,winner:null,locked:false,log:['Starter Link established.']}}

export default function Home(){
 const [screen,setScreen]=useState<'home'|'lobby'|'game'>('home'); const [name,setName]=useState('PLAYER 01'); const [room,setRoom]=useState(''); const [game,setGame]=useState<Game|null>(null); const [selected,setSelected]=useState<string|null>(null); const [online,setOnline]=useState(false); const channel=useRef<any>(null); const myId=useRef(uid()); const host=useRef(false);
 const active=game?.players[game.turn]; const me=game?.players.find(p=>p.id===myId.current) || game?.players[0]; const top=game?.chains[game.activeHead]?.at(-1); const playable=useMemo(()=>new Set(me?.hand.filter(c=>canPlay(c,top)).map(c=>c.id)),[me,top]);
 function broadcast(g:Game){if(channel.current) channel.current.send({type:'broadcast',event:'state',payload:g})}
 async function create(){const code=Math.random().toString(36).slice(2,8).toUpperCase();setRoom(code);host.current=true;const g=initialGame(name);g.players[0].id=myId.current;setGame(g);setScreen('lobby');if(supabase){const ch=supabase.channel(`kinetix:${code}`,{config:{broadcast:{self:false}}});channel.current=ch;ch.on('broadcast',{event:'join'},({payload}:any)=>{if(!g.players.some(p=>p.id===payload.id)){g.players.push({id:payload.id,name:payload.name,hand:[],connected:true});setGame({...g});broadcast(g)}}).on('broadcast',{event:'intent'},({payload}:any)=>{if(host.current) handleIntent(payload)}).subscribe(()=>setOnline(true));}}
 async function join(){if(!room.trim())return;host.current=false;const id=myId.current;const ch=supabase?.channel(`kinetix:${room.trim().toUpperCase()}`,{config:{broadcast:{self:true}}});channel.current=ch;if(ch){ch.on('broadcast',{event:'state'},({payload}:any)=>{setGame(payload);setScreen('game')}).subscribe(async status=>{if(status==='SUBSCRIBED'){setOnline(true);await ch.send({type:'broadcast',event:'join',payload:{id,name}})}})}else{setGame(initialGame(name));setScreen('game')}}
 function start(){if(!game)return;setScreen('game');broadcast(game)}
 function handleIntent(x:any){if(!game)return;const g=structuredClone(game);const p=g.players[g.turn];if(!p||p.id!==x.player)return;if(x.action==='draw'){const c=g.deck.shift();if(c)p.hand.push(c);g.log.unshift(`${p.name} drew a card.`)}
 else if(x.action==='play'){const card=p.hand.find(c=>c.id===x.id);if(!card||!canPlay(card,g.chains[g.activeHead].at(-1)))return;p.hand=p.hand.filter(c=>c.id!==card.id);applyCard(g,card)}
 setGame(g);broadcast(g)}
 function applyCard(g:Game,c:Card){const p=g.players[g.turn];g.chains[g.activeHead].push(c);g.log.unshift(`${p.name} played ${c.kind==='number'?`#${c.value}`:c.label}.`);
   if(!p.hand.length){g.winner=p.name;return}
   if(c.kind==='reverse'){g.turnDir=g.turnDir===1?-1:1;g.activeHead=g.activeHead===0?1:0;if(!g.chains[g.activeHead])g.chains[g.activeHead]=[];g.log.unshift('REVERSE CURRENT: opposite chain head is now active.');}
   if(c.kind==='chainSplit'){g.chains.push([]);g.log.unshift('CHAIN SPLIT: a second independent chain opens.');}
   if(c.kind==='purge'){g.chains=[[starter()]];g.activeHead=0;g.log.unshift('PURGE: all active chains cleared.');}
   if(c.kind==='snatch'){const target=g.players.find((q,i)=>i!==g.turn&&q.hand.length);if(target){const stolen=target.hand.splice(Math.floor(Math.random()*target.hand.length),1)[0];const give=p.hand.shift();if(stolen)p.hand.push(stolen);if(give)target.hand.push(give);g.log.unshift(`SNATCH: ${p.name} exchanged a card with ${target.name}.`)}}
   if(c.kind==='overload'){g.log.unshift('OVERLOAD: shift the active number by ±3 within 1–12.');}
   if(c.kind==='linkLock'){g.locked=true;g.log.unshift('LINK LOCK: active endpoint is locked.');}
   g.turn=(g.turn+g.turnDir+g.players.length)%g.players.length;
 }
 function act(c?:Card){if(!game||!me||game.winner||me.id!==active?.id)return;if(c){if(selected!==c.id){setSelected(c.id);return}handleIntent({player:me.id,action:'play',id:c.id});setSelected(null)}else handleIntent({player:me.id,action:'draw'})}
 useEffect(()=>()=>{channel.current?.unsubscribe?.()},[]);
 const copy=()=>navigator.clipboard?.writeText(room);
 return <main className="kx-app"><header><div className="kx-brand"><div className="kx-mark">K</div><div><b>KINETIX</b><small>ONLINE EDITION / 02</small></div></div><div className="connection"><i className={online?'live':''}/>{online?'REALTIME LINK':'LOCAL PRACTICE'}</div><button className="icon-btn" onClick={()=>{channel.current?.unsubscribe?.();setScreen('home');setGame(null)}}><LogOut size={15}/> EXIT</button></header>
 {screen==='home'&&<section className="home"><div className="hero"><span className="eyebrow">STRATEGIC CHAIN-BUILDING / ONLINE</span><h1>CONTROL<br/><em>THE CURRENT.</em></h1><p>KINETIX is built around a living chain. Match color and direction, exploit the active head, trigger actions and survive the explosion.</p><div className="entry"><input value={name} onChange={e=>setName(e.target.value.toUpperCase().slice(0,14))}/><button onClick={create}>CREATE ROOM <Zap size={15}/></button></div><div className="join"><input placeholder="ROOM CODE" value={room} onChange={e=>setRoom(e.target.value.toUpperCase())}/><button onClick={join}>JOIN <Wifi size={15}/></button></div><small className="note">Online rooms use Supabase Realtime when environment keys are configured. Without them, practice mode still works.</small></div><div className="showcase"><div className="stack">{[1,5,9,12].map((n,i)=><CardView key={n} small card={{id:String(n),color:COLORS[i],value:n,dir:n<=4?'up':n<=8?'any':'down',kind:'number',label:String(n)}}/> )}</div><div className="special"><CardView card={{id:'w',kind:'wildColor',label:'COLOR SHIFT'}}/><CardView card={{id:'r',kind:'reverse',label:'REVERSE CURRENT'}}/></div></div><div className="stats"><b>80 <small>CARDS</small></b><b>5 <small>START HAND</small></b><b>2 <small>OPEN HEADS</small></b><b>∞ <small>CHAIN TENSION</small></b></div></section>}
 {screen==='lobby'&&game&&<section className="lobby"><span className="eyebrow">ROOM / WAITING AREA</span><h2>{room}</h2><p>Share the room code. The host starts when everyone is ready.</p><div className="room-card"><div><span>INVITE CODE</span><strong>{room}</strong></div><button onClick={copy}><Copy size={16}/> COPY</button></div><div className="players">{game.players.map((p,i)=><div key={p.id}><span>{String(i+1).padStart(2,'0')}</span><b>{p.name}</b><small>{i===0?'HOST':'CONNECTED'}</small></div>)}</div><button className="start" onClick={start}>START KINETIX <Zap size={16}/></button><small className="note">{supabase?'Realtime multiplayer is ready.':'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for cross-device rooms.'}</small></section>}
 {screen==='game'&&game&&<section className="game"><div className="game-head"><div><span className="eyebrow">ROOM / {room||'PRACTICE'} / {game.players.length} PLAYERS</span><h2>{game.winner?`${game.winner} WINS`:'THE ARENA'}</h2></div><div className="turn"><span>ACTIVE CURRENT</span><b>{active?.name}</b><small>{game.turnDir===1?'→ CLOCKWISE':'← REVERSED'} · HEAD {game.activeHead+1}</small></div></div><div className="board"><div className="opponents">{game.players.filter(p=>p.id!==me?.id).map(p=><div className={p.id===active?.id?'active':''} key={p.id}><Users size={14}/><b>{p.name}</b><span>{p.hand.length} CARDS</span></div>)}</div><div className="heads">{game.chains.map((chain,i)=><div className={`head ${i===game.activeHead?'on':''}`} key={i}><span>CHAIN {i+1} {i===game.activeHead?'· ACTIVE':''}</span><div>{chain.slice(-3).map(c=><CardView key={c.id} card={c} small/>)}</div></div>)}</div><div className="center"><div className="deck"><CardView back/><b>{game.deck.length}</b></div><div className="status"><i/>{game.winner?`${game.winner} completed their hand.`:game.log[0]}</div></div><div className="myhand"><div className="hand-label"><span>YOUR HAND / {me?.hand.length}</span><small>{me?.id===active?.id?'YOUR CURRENT':'WAIT FOR CURRENT'}</small></div><div className="hand">{me?.hand.map(c=><CardView key={c.id} card={c} selected={selected===c.id} onClick={()=>act(c)}/>)}</div><div className="actions"><button disabled={me?.id!==active?.id||!!game.winner} onClick={()=>act()}>DRAW CARD <RotateCcw size={14}/></button><span>{me?.id===active?.id?'Click once to select · twice to play':'Another player controls the current'}</span></div></div></div><div className="rules"><b>▲ UP</b><span>1–4 rise</span><b>= ANY</b><span>5–8 flexible</span><b>▼ DOWN</b><span>9–12 fall</span><b>REVERSE</b><span>switch head + turn flow</span><b>PENALTY</b><span>explosion collects the affected chain</span></div></section>}
 <footer>KINETIX / ONLINE EDITION <span>CONTROL THE CURRENT · 2026</span><span>80 CARDS · 5 CARD HAND</span></footer></main>
}
