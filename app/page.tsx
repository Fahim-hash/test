'use client';

import { useMemo, useState } from 'react';

type CardKind = 'LINK' | 'BOOST' | 'BREAK' | 'REVERSE CURRENT' | 'WILD';
type Card = { id: number; kind: CardKind; color: string; value: string };

type Player = { name: string; hand: Card[]; score: number };

const COLORS = ['red', 'blue', 'violet', 'gold'];
const KINDS: CardKind[] = ['LINK', 'BOOST', 'BREAK', 'REVERSE CURRENT', 'WILD'];

function buildDeck() {
  const deck: Card[] = [];
  let id = 1;
  for (let round = 0; round < 5; round++) {
    for (const color of COLORS) {
      for (const kind of KINDS) {
        deck.push({ id: id++, kind, color, value: kind === 'REVERSE CURRENT' ? '↔' : kind === 'WILD' ? '✦' : String(round + 1) });
      }
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function playable(card: Card, top: Card) {
  return card.kind === 'WILD' || card.color === top.color || card.kind === top.kind || card.value === top.value;
}

function CardView({ card, selected, onClick, disabled = false }: { card: Card; selected?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`kin-card ${card.color} ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`} aria-label={`${card.color} ${card.kind} ${card.value}`}>
      <span className="card-corner">{card.value}</span>
      <span className="card-kind">{card.kind}</span>
      <span className="card-glyph">{card.kind === 'LINK' ? '◈' : card.kind === 'BOOST' ? '↗' : card.kind === 'BREAK' ? '×' : card.kind === 'REVERSE CURRENT' ? '⟲' : '✦'}</span>
      <span className="card-corner bottom">{card.value}</span>
    </button>
  );
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [discard, setDiscard] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState('Create a match to enter the arena.');
  const [winner, setWinner] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const top = discard[discard.length - 1];
  const active = players[current];
  const canPlay = useMemo(() => active?.hand.map((c) => playable(c, top)) ?? [], [active, top]);

  function startGame(count = 2) {
    const pile = buildDeck();
    const nextPlayers: Player[] = Array.from({ length: count }, (_, i) => ({ name: i === 0 ? 'YOU' : `RIVAL ${i}`, hand: pile.splice(0, 7), score: 0 }));
    const first = pile.shift()!;
    setPlayers(nextPlayers); setDeck(pile); setDiscard([first]); setCurrent(0); setDirection(1); setWinner(null); setSelected(null); setStarted(true);
    setStatus(`Current: YOU. Match ${count} players. Build the chain.`);
  }

  function draw() {
    if (!active) return;
    let nextDeck = [...deck];
    let nextDiscard = [...discard];
    if (!nextDeck.length && nextDiscard.length > 1) {
      const keep = nextDiscard.pop()!;
      nextDeck = nextDiscard.sort(() => Math.random() - 0.5);
      nextDiscard = [keep];
    }
    const card = nextDeck.shift();
    if (!card) return;
    const nextPlayers = players.map((p, i) => i === current ? { ...p, hand: [...p.hand, card] } : p);
    setPlayers(nextPlayers); setDeck(nextDeck); setDiscard(nextDiscard); setSelected(null); setStatus(`${active.name} drew a card.`);
  }

  function play(card: Card) {
    if (!active || !playable(card, top)) return;
    const nextHand = active.hand.filter((c) => c.id !== card.id);
    const nextPlayers = players.map((p, i) => i === current ? { ...p, hand: nextHand } : p);
    setPlayers(nextPlayers); setDiscard([...discard, card]); setSelected(null);

    if (!nextHand.length) {
      setWinner(active.name); setStatus(`${active.name} completed the chain.`); return;
    }

    let nextDirection = direction;
    if (card.kind === 'REVERSE CURRENT') nextDirection *= -1;
    setDirection(nextDirection);
    let step = card.kind === 'BREAK' ? 2 : 1;
    const nextIndex = (current + nextDirection * step + nextPlayers.length) % nextPlayers.length;
    setCurrent(nextIndex);
    setStatus(card.kind === 'REVERSE CURRENT' ? `${active.name} played REVERSE CURRENT. Direction flipped.` : `${active.name} played ${card.kind}.`);

    if (nextPlayers.length > 1 && nextIndex !== 0) {
      window.setTimeout(() => aiTurn(nextIndex, nextPlayers, nextDirection, card), 450);
    }
  }

  function aiTurn(index: number, statePlayers: Player[], dir: number, topCard: Card) {
    const ai = statePlayers[index];
    if (!ai || winner) return;
    const possible = ai.hand.find((c) => playable(c, topCard));
    if (possible) {
      const hand = ai.hand.filter((c) => c.id !== possible.id);
      const updated = statePlayers.map((p, i) => i === index ? { ...p, hand } : p);
      setPlayers(updated); setDiscard((d) => [...d, possible]);
      let nd = dir;
      if (possible.kind === 'REVERSE CURRENT') nd *= -1;
      if (!hand.length) { setWinner(ai.name); setStatus(`${ai.name} completed the chain.`); return; }
      const skip = possible.kind === 'BREAK' ? 2 : 1;
      const ni = (index + nd * skip + updated.length) % updated.length;
      setDirection(nd); setCurrent(ni); setStatus(`${ai.name} played ${possible.kind}.`);
      if (ni !== 0) window.setTimeout(() => aiTurn(ni, updated, nd, possible), 500);
    } else {
      const oldDeck = [...deck]; const drawn = oldDeck.shift();
      if (drawn) setPlayers(statePlayers.map((p, i) => i === index ? { ...p, hand: [...p.hand, drawn] } : p));
      setDeck(oldDeck); setCurrent(0); setStatus(`${ai.name} could not link — your turn.`);
    }
  }

  function reset() { setStarted(false); setPlayers([]); setDeck([]); setDiscard([]); setWinner(null); setStatus('Create a match to enter the arena.'); }

  return (
    <main className="kinetix-app">
      <header className="kin-nav">
        <div className="brand"><span className="brand-mark">K</span><div><strong>KINETIX</strong><small>WEB EDITION / 01</small></div></div>
        <div className="nav-status"><span className="pulse" /> LIVE RULESET <b>v1.0</b></div>
        <button className="ghost-btn" onClick={reset}>EXIT MATCH</button>
      </header>

      {!started ? (
        <section className="landing">
          <div className="eyebrow">STRATEGIC CHAIN-BUILDING CARD GAME</div>
          <h1>CONTROL<br /><em>THE CURRENT.</em></h1>
          <p>Build chains. Break momentum. Reverse the table. KINETIX is a fast tactical card battle where every move changes what comes next.</p>
          <div className="start-row"><button className="primary-btn" onClick={() => startGame(2)}>START 1V1 <span>↗</span></button><button className="secondary-btn" onClick={() => startGame(3)}>3 PLAYER</button></div>
          <div className="landing-grid"><div><b>07</b><span>Cards / hand</span></div><div><b>05</b><span>Card classes</span></div><div><b>⟲</b><span>Current can reverse</span></div></div>
        </section>
      ) : (
        <section className="arena">
          <div className="arena-top"><div><span className="eyebrow">MATCH / {players.length} PLAYERS</span><h2>{winner ? 'CHAIN COMPLETE' : 'THE ARENA'}</h2></div><div className="turn-box"><span>TURN</span><strong>{active?.name}</strong><small>{direction === 1 ? 'CLOCKWISE →' : '← REVERSED'}</small></div></div>
          <div className="table">
            <div className="opponents">{players.slice(1).map((p, i) => <div className="opponent" key={p.name}><span className="mini-avatar">{i + 1}</span><div><b>{p.name}</b><small>{p.hand.length} cards</small></div><strong>{String(p.score).padStart(2, '0')}</strong></div>)}</div>
            <div className="center-pile"><div className="chain-label">CHAIN / {discard.length}</div><div className="pile-cards"><div className="deck-back"><span>K</span><small>KINETIX</small></div>{top && <CardView card={top} disabled />}</div><div className="status-line"><i /> {winner ? `${winner} wins the match.` : status}</div></div>
            <div className="your-area"><div className="your-label"><span>YOUR HAND</span><b>{active?.hand.length} CARDS</b></div><div className="hand">{active?.hand.map((card, i) => <CardView key={card.id} card={card} selected={selected === i} disabled={current !== 0 || !!winner || !canPlay[i]} onClick={() => play(card)} />)}</div><div className="action-row"><button className="draw-btn" onClick={draw} disabled={current !== 0 || !!winner}>DRAW CARD <span>↓</span></button><span className="hint">{current === 0 ? 'Select a glowing card to play' : 'Opponent is calculating…'}</span></div></div>
          </div>
          <div className="rules-strip"><div><b>LINK</b><span>Match color, kind or value.</span></div><div><b>BREAK</b><span>Skip the next current.</span></div><div><b>REVERSE CURRENT</b><span>Flip direction instantly.</span></div><div><b>WILD</b><span>Connect to anything.</span></div></div>
        </section>
      )}

      <footer className="kin-footer"><span>KINETIX / WEB EDITION</span><span>BUILT FOR THE CHAIN · 2026</span><span>NO LOGIN · LOCAL PLAY</span></footer>
    </main>
  );
}
