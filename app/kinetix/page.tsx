'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import './kinetix.css';

type Color = 'crimson' | 'ocean' | 'forest' | 'amber';
type Dir = 'up' | 'any' | 'down';
type Kind = 'number' | 'wildColor' | 'wildNumber' | 'chainSplit' | 'linkLock' | 'reverse' | 'overload' | 'purge' | 'snatch';
type Card = { id: string; kind: Kind; label: string; color?: Color; value?: number; dir?: Dir };
type Player = { id: string; name: string; hand: Card[]; bot?: boolean };
type Game = { deck: Card[]; discard: Card[]; chains: Card[][]; activeChain: number; activeHead: 0 | 1; players: Player[]; turn: number; turnDir: 1 | -1; locked: boolean; winner: string | null; log: string[] };

const COLORS: Color[] = ['crimson', 'ocean', 'forest', 'amber'];
const COLOR_HEX: Record<Color, string> = { crimson: '#e51e46', ocean: '#08708f', forest: '#278a31', amber: '#f3b94f' };
const CARD_FILE_COLOR: Record<Color, string> = { crimson: 'RED', ocean: 'BLUE', forest: 'GREEN', amber: 'YELLOW' };
const uid = () => Math.random().toString(36).slice(2, 10);
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function cardSrc(card: Card) {
  if (card.kind === 'number' && card.color && card.value) return `/data/cards/${CARD_FILE_COLOR[card.color]} ${card.value}.pdf`;
  const files: Record<Exclude<Kind, 'number'>, string> = {
    wildColor: 'COLOUR CHANGE.pdf', wildNumber: 'NUMBER SHIFT.pdf', chainSplit: 'CHAIN SPLIT.pdf',
    linkLock: 'CHAIN LOCK.pdf', reverse: 'REVERSE.pdf', overload: '+3 CARD.pdf', purge: 'PURGE.pdf', snatch: 'SNATCH.pdf',
  };
  return `/data/cards/${files[card.kind]}`;
}

function makeDeck() {
  const deck: Card[] = [];
  for (const color of COLORS) for (let value = 1; value <= 12; value++) deck.push({ id: uid(), kind: 'number', label: String(value), color, value, dir: value <= 4 ? 'up' : value <= 8 ? 'any' : 'down' });
  for (let i = 0; i < 2; i++) { deck.push({ id: uid(), kind: 'wildColor', label: 'COLOR SHIFT' }); deck.push({ id: uid(), kind: 'wildNumber', label: 'NUMBER SHIFT' }); }
  const add = (kind: Kind, label: string, count: number) => { for (let i = 0; i < count; i++) deck.push({ id: uid(), kind, label }); };
  add('chainSplit', 'CHAIN SPLIT', 5); add('linkLock', 'LINK LOCK', 5); add('reverse', 'REVERSE CURRENT', 5); add('overload', 'OVERLOAD', 5); add('purge', 'PURGE', 4); add('snatch', 'SNATCH', 4);
  return shuffle(deck);
}

function takeStarter(deck: Card[]) {
  const index = deck.findIndex(card => card.kind === 'number');
  return index >= 0 ? deck.splice(index, 1)[0] : { id: uid(), kind: 'number' as const, label: '1', color: 'crimson' as Color, value: 1, dir: 'up' as Dir };
}

function makeGame(name: string, bots: number): Game {
  const deck = makeDeck();
  const players: Player[] = [{ id: uid(), name: name || 'PLAYER', hand: [], bot: false }];
  for (let i = 0; i < bots; i++) players.push({ id: uid(), name: `BOT ${String(i + 1).padStart(2, '0')}`, hand: [], bot: true });
  players.forEach(player => { player.hand = deck.splice(0, 5); });
  const starter = takeStarter(deck);
  return { deck, discard: [], chains: [[starter]], activeChain: 0, activeHead: 0, players, turn: 0, turnDir: 1, locked: false, winner: null, log: ['Starter Link established.'] };
}

function endpoint(game: Game) {
  const chain = game.chains[game.activeChain] || [];
  return game.activeHead === 0 ? chain[chain.length - 1] : chain[0];
}

function numberPlayable(card: Card, top?: Card) {
  if (card.kind !== 'number') return true;
  if (!top || top.kind !== 'number') return true;
  if (card.color !== top.color) return false;
  if (top.dir === 'any' || card.dir === 'any') return true;
  if (card.value === top.value) return true;
  if (top.dir === 'up') return (card.value ?? 0) > (top.value ?? 0);
  return (card.value ?? 99) < (top.value ?? 99);
}

function playable(card: Card, game: Game) {
  return numberPlayable(card, endpoint(game));
}

function draw(game: Game, player: Player, amount = 1) {
  for (let i = 0; i < amount; i++) {
    if (!game.deck.length) { game.deck = shuffle(game.discard.splice(0)); if (!game.deck.length) break; }
    const card = game.deck.shift(); if (card) player.hand.push(card);
  }
}

function appendToHead(game: Game, card: Card) {
  const chain = game.chains[game.activeChain] || (game.chains[game.activeChain] = []);
  if (game.activeHead === 0) chain.push(card); else chain.unshift(card);
}

function advanceTurn(game: Game) { game.turn = (game.turn + game.turnDir + game.players.length) % game.players.length; }

function resolveCard(game: Game, card: Card, choice?: { color?: Color; number?: number }) {
  const player = game.players[game.turn];
  appendToHead(game, card);
  game.discard.push(card);
  game.log.unshift(`${player.name} played ${card.label}.`);

  if (!player.hand.length) { game.winner = player.name; return; }

  if (card.kind === 'reverse') {
    game.turnDir = game.turnDir === 1 ? -1 : 1;
    game.activeHead = game.activeHead === 0 ? 1 : 0;
    game.log.unshift('REVERSE CURRENT: play continues from the opposite physical end.');
  }
  if (card.kind === 'wildColor') game.log.unshift(`COLOR SHIFT: ${choice?.color?.toUpperCase() || 'color chosen'}.`);
  if (card.kind === 'wildNumber') game.log.unshift(`NUMBER SHIFT: ${choice?.number ?? 1} declared.`);
  if (card.kind === 'linkLock') { game.locked = true; game.log.unshift('LINK LOCK: this endpoint is locked until broken.'); }
  if (card.kind === 'chainSplit') {
    const current = game.chains[game.activeChain];
    if (current.length > 2) {
      const cut = Math.max(1, Math.floor(current.length / 2));
      const second = current.splice(cut);
      game.chains.push(second);
      game.activeChain = game.chains.length - 1;
      game.activeHead = 0;
    } else {
      game.chains.push([card]); game.activeChain = game.chains.length - 1; game.activeHead = 0;
    }
    game.log.unshift('CHAIN SPLIT: two independent chains are now active.');
  }
  if (card.kind === 'overload') {
    const top = endpoint(game); if (top?.kind === 'number') {
      const next = Math.max(1, Math.min(12, (top.value ?? 1) + ((top.value ?? 1) >= 7 ? -3 : 3)));
      game.log.unshift(`OVERLOAD: endpoint shifts to ${next}.`);
    }
  }
  if (card.kind === 'purge') {
    game.chains = [[takeStarter(game.deck)]]; game.activeChain = 0; game.activeHead = 0; game.locked = false;
    game.log.unshift('PURGE: active chains cleared and a new Starter Link is placed.');
  }
  if (card.kind === 'snatch') {
    const targets = game.players.filter((_, i) => i !== game.turn && game.players[i].hand.length);
    const target = targets[0];
    if (target && player.hand.length) {
      const stolen = target.hand.splice(Math.floor(Math.random() * target.hand.length), 1)[0];
      const offered = player.hand.shift();
      if (stolen) player.hand.push(stolen); if (offered) target.hand.push(offered);
      game.log.unshift(`SNATCH: ${player.name} exchanged a random card with ${target.name}.`);
    }
  }
  if (game.locked && card.kind !== 'linkLock' && card.kind !== 'number') game.locked = false;
  advanceTurn(game);
}

function CardView({ card, onClick, disabled, selected, back = false }: { card: Card; onClick?: () => void; disabled?: boolean; selected?: boolean; back?: boolean }) {
  const accent = card.color ? COLOR_HEX[card.color] : '#e9e5da';
  return <div role={onClick ? 'button' : undefined} tabIndex={onClick && !disabled ? 0 : -1} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }} onClick={disabled ? undefined : onClick} className={`kx-card ${card.color || 'black'} ${selected ? 'selected' : ''} ${disabled ? 'is-disabled' : ''} ${back ? 'card-back' : ''}`} style={{ '--accent': accent } as React.CSSProperties} aria-label={card.label}>
    <iframe className="card-art" src={back ? '/data/cards/FRONT SIDE OF A CARD.pdf' : cardSrc(card)} title={back ? 'KINETIX card back' : `${card.label} card artwork`} tabIndex={-1} />
    <div className="card-art-fallback"><span>{card.value ?? 'K'}</span><b>{card.label}</b></div>
  </div>;
}

export default function KinetixPage() {
  const [name, setName] = useState('PLAYER 01');
  const [bots, setBots] = useState(2);
  const [game, setGame] = useState<Game | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [choice, setChoice] = useState<{ type: 'color' | 'number'; card: Card } | null>(null);
  const gameRef = useRef<Game | null>(null);
  const humanId = useRef('');
  const sync = (next: Game) => { gameRef.current = next; setGame({ ...next }); };
  const me = game?.players.find(p => p.id === humanId.current) || game?.players[0];
  const active = game?.players[game.turn];
  const top = game ? endpoint(game) : undefined;
  const playableIds = useMemo(() => new Set(me?.hand.filter(card => game && playable(card, game)).map(card => card.id)), [me, game]);

  const start = () => { humanId.current = uid(); const g = makeGame(name.trim().toUpperCase(), bots); g.players[0].id = humanId.current; sync(g); };
  const restart = () => { setSelected(null); setChoice(null); start(); };

  const playCard = (card: Card, selectedChoice?: { color?: Color; number?: number }) => {
    const current = gameRef.current; if (!current || current.winner || current.players[current.turn].id !== humanId.current) return;
    if (!playable(card, current)) return;
    const next = structuredClone(current) as Game;
    const player = next.players[next.turn];
    player.hand = player.hand.filter(c => c.id !== card.id);
    resolveCard(next, card, selectedChoice);
    sync(next);
    setSelected(null); setChoice(null);
  };

  const humanAction = (card: Card) => {
    if (!game || active?.id !== humanId.current || game.winner) return;
    if (!playableIds.has(card.id)) return;
    if (card.kind === 'wildColor') { setChoice({ type: 'color', card }); return; }
    if (card.kind === 'wildNumber') { setChoice({ type: 'number', card }); return; }
    if (selected !== card.id) { setSelected(card.id); return; }
    playCard(card);
  };

  const drawCard = () => {
    const current = gameRef.current; if (!current || current.winner || current.players[current.turn].id !== humanId.current) return;
    const next = structuredClone(current) as Game; draw(next, next.players[next.turn]); next.log.unshift(`${next.players[next.turn].name} drew a card.`); advanceTurn(next); sync(next);
  };

  useEffect(() => {
    if (!game || game.winner || !active?.bot) return;
    const timer = setTimeout(() => {
      const current = gameRef.current; if (!current || current.winner || !current.players[current.turn].bot) return;
      const next = structuredClone(current) as Game; const player = next.players[next.turn];
      const options = player.hand.filter(card => playable(card, next));
      if (!options.length) { draw(next, player); next.log.unshift(`${player.name} drew a card.`); advanceTurn(next); sync(next); return; }
      const card = options.sort((a, b) => (a.kind === 'number' ? 0 : 1) - (b.kind === 'number' ? 0 : 1))[0];
      player.hand = player.hand.filter(c => c.id !== card.id);
      resolveCard(next, card, { color: COLORS[Math.floor(Math.random() * COLORS.length)], number: 1 + Math.floor(Math.random() * 12) });
      sync(next);
    }, 650);
    return () => clearTimeout(timer);
  }, [game, active]);

  if (!game) return <main className="kx-shell"><header className="kx-nav"><div className="kx-logo"><span>K</span><div><b>KINETIX</b><small>ONLINE EDITION</small></div></div><span className="kx-status">● READY TO PLAY</span></header><section className="kx-home"><div><p className="eyebrow">STRATEGIC CHAIN-BUILDING</p><h1>CONTROL<br/><i>THE CURRENT.</i></h1><p className="lead">Build the chain. Switch its direction. Break locked links. Trigger actions. Empty your hand before the current explodes.</p><div className="setup"><label>CALLSIGN<input value={name} onChange={e => setName(e.target.value.toUpperCase().slice(0, 14))}/></label><label>OPPONENTS<select value={bots} onChange={e => setBots(Number(e.target.value))}><option value={1}>1 BOT</option><option value={2}>2 BOTS</option><option value={3}>3 BOTS</option></select></label><button onClick={start}>START KINETIX <span>→</span></button></div><p className="fine">Real KINETIX card artwork is loaded directly from <code>data/cards</code>.</p></div><div className="hero-cards"><CardView card={{ id: 'a', kind: 'number', label: '4', value: 4, color: 'crimson', dir: 'up' }}/><CardView card={{ id: 'b', kind: 'number', label: '8', value: 8, color: 'ocean', dir: 'any' }}/><CardView card={{ id: 'c', kind: 'reverse', label: 'REVERSE CURRENT' }}/></div></section><footer>KINETIX / 80 CARDS / 5 CARD HAND / CONTROL THE CURRENT</footer></main>;

  return <main className="kx-shell"><header className="kx-nav"><div className="kx-logo"><span>K</span><div><b>KINETIX</b><small>ONLINE EDITION</small></div></div><div className="kx-room">LOCAL ARENA <strong>{game.players.length} PLAYERS</strong></div><button className="kx-quiet" onClick={restart}>NEW GAME</button></header>
    <section className="kx-game"><div className="kx-game-top"><div><p className="eyebrow">THE ARENA</p><h2>{game.winner ? `${game.winner} WINS` : 'CONTROL THE CURRENT'}</h2></div><div className="turn-box"><small>CURRENT PLAYER</small><b>{active?.name}</b><span>{game.turnDir === 1 ? '→ CLOCKWISE' : '← REVERSED'} · CHAIN {game.activeChain + 1} · {game.activeHead === 0 ? 'HEAD A' : 'HEAD B'}</span></div></div>
      <div className="arena"><aside className="side"><div className="side-title">PLAYERS</div>{game.players.map((p, i) => <div key={p.id} className={`player ${p.id === active?.id ? 'active' : ''}`}><span>{String(i + 1).padStart(2, '0')}</span><b>{p.name}</b><em>{p.hand.length}</em></div>)}<div className="side-title space">CURRENT LINK</div><div className="endpoint"><small>ACTIVE ENDPOINT</small><b>{top?.label}</b><span>{top?.color ? top.color.toUpperCase() : 'ACTION'} {top?.value ? `· ${top.value}` : ''}</span>{game.locked && <i>LOCKED</i>}</div></aside>
        <div className="board"><div className="board-meta"><span>CHAIN NETWORK / {game.chains.length} ACTIVE</span><span>DECK {game.deck.length}</span></div><div className="chains">{game.chains.map((chain, i) => <div key={i} className={`chain ${i === game.activeChain ? 'current' : ''}`}><label>CHAIN {i + 1}{i === game.activeChain ? ' · CURRENT' : ''}</label><div className="chain-row">{chain.slice(-6).map(card => <CardView key={card.id} card={card}/>)}</div></div>)}</div><div className="board-bottom"><div className="deck-stack"><CardView back card={{ id: 'deck', kind: 'number', label: 'DECK', value: 0 }}/><b>{game.deck.length}</b></div><div className="event-log">{game.log.slice(0, 5).map((line, i) => <p key={`${line}-${i}`}>{line}</p>)}</div></div></div>
      </div>
      <div className="hand-panel"><div className="hand-head"><span>YOUR HAND <b>{me?.hand.length}</b></span><small>{active?.id === humanId.current ? 'YOUR TURN · SELECT THEN PLAY' : `WAITING FOR ${active?.name}`}</small></div><div className="hand-row">{me?.hand.map(card => <CardView key={card.id} card={card} selected={selected === card.id} disabled={!playableIds.has(card.id) || active?.id !== humanId.current || !!game.winner} onClick={() => humanAction(card)}/>)}</div><div className="hand-actions"><button disabled={active?.id !== humanId.current || !!game.winner} onClick={drawCard}>DRAW CARD <span>↻</span></button><span>Number cards match color + direction. Action cards are always playable.</span></div></div>
    </section>
    {choice && <div className="choice-backdrop"><div className="choice"><p className="eyebrow">{choice.type === 'color' ? 'COLOR SHIFT' : 'NUMBER SHIFT'}</p><h3>{choice.type === 'color' ? 'Choose the new color' : 'Declare the next number'}</h3>{choice.type === 'color' ? <div className="choices">{COLORS.map(color => <button key={color} style={{ '--accent': COLOR_HEX[color] } as React.CSSProperties} onClick={() => playCard(choice.card, { color })}>{color}</button>)}</div> : <div className="number-grid">{Array.from({ length: 12 }, (_, i) => i + 1).map(number => <button key={number} onClick={() => playCard(choice.card, { number })}>{number}</button>)}</div>}</div></div>}
    <footer>KINETIX / 80 CARDS <span>▲ 1–4 UP · = 5–8 ANY · ▼ 9–12 DOWN</span><span>REVERSE CURRENT · CHAIN SPLIT · LINK LOCK · OVERLOAD · PURGE · SNATCH</span></footer>
  </main>;
}
