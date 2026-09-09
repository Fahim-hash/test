'use client';

import Link from 'next/link';
import { useState } from 'react';

const skills = [
  { name: 'Graphic Design', score: 94, level: 'Advanced' },
  { name: 'Video Editing', score: 89, level: 'Intermediate' },
  { name: 'Web Development', score: 92, level: 'Advanced' },
];

const candidates = [
  ['AR', 'Arif Rahman', 'Graphic Design', '94'],
  ['SK', 'Sadia Karim', 'Social Design', '91'],
  ['RH', 'Rafi Hasan', 'Branding', '87'],
];

export default function Home() {
  const [toast, setToast] = useState('');
  const [activeSkill, setActiveSkill] = useState(0);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <main className="site">
      <div className="topline"><span>SKILLPROOF / BETA</span><button onClick={() => notify('You are on the early-access list.')}>Get early access →</button></div>

      <header className="site-nav shell">
        <Link href="/" className="logo"><span>S</span> skillproof</Link>
        <nav><a href="#product">Product</a><a href="#proof">Proof</a><a href="#hiring">For employers</a><a href="#pricing">Pricing</a></nav>
        <Link href="/trial" className="nav-cta">Try demo</Link>
      </header>

      <section className="new-hero shell">
        <div className="hero-label">THE SKILL CREDENTIAL</div>
        <h1>Show what you can <span>do.</span></h1>
        <p className="hero-lead">A practical way to verify skills, build credible proof, and help employers hire beyond the CV.</p>
        <div className="hero-buttons"><Link href="/trial" className="black-button">Build your proof <b>↗</b></Link><a href="#product" className="plain-button">See how it works ↓</a></div>
        <div className="hero-note"><span>01</span> Practical challenges <span>02</span> Transparent scoring <span>03</span> Public proof</div>
      </section>

      <section className="proof-preview shell" id="proof">
        <div className="preview-intro"><span>01 / PROOF PROFILE</span><h2>Your CV says it.<br /><em>Your proof shows it.</em></h2></div>
        <div className="profile-ui">
          <div className="profile-head"><div className="person"><div className="person-avatar">FM</div><div><b>Fahim M.</b><small>Graphic Designer · Bangladesh</small></div></div><span className="verified-pill">✓ VERIFIED</span></div>
          <div className="profile-score"><div><small>OVERALL SCORE</small><strong>94</strong><span>/100</span></div><div className="score-copy"><b>Excellent</b><p>Top 8% of verified designers</p></div></div>
          <div className="profile-skills">{['Photoshop','Illustrator','Social Design'].map((skill, i) => <div key={skill}><span>{skill}</span><div><i style={{ width: `${[96,92,94][i]}%` }} /></div><b>{[96,92,94][i]}</b></div>)}</div>
          <div className="profile-foot"><span>Verified · 09 Sep 2026</span><span>SP-8F42K</span></div>
        </div>
      </section>

      <section className="statement" id="product"><div className="shell statement-grid"><span className="section-index">02 / THE IDEA</span><div><h2>Credentials explain <em>where</em> you learned. Proof explains <strong>what you can do.</strong></h2><p>SkillProof gives candidates a standardized way to demonstrate practical ability and gives employers a better signal than self-reported skills.</p></div></div></section>

      <section className="steps-section shell">
        <div className="section-top"><span>03 / HOW IT WORKS</span><h2>Three steps.<br />One clear signal.</h2></div>
        <div className="new-steps">
          <article><span>01</span><h3>Choose a skill</h3><p>Select a practical skill and difficulty level. No degree filter. No keyword games.</p><Link href="/challenges">Browse challenges →</Link></article>
          <article><span>02</span><h3>Do real work</h3><p>Complete a realistic task under a clear brief and submit the work you actually produced.</p><Link href="/trial">Try a challenge →</Link></article>
          <article><span>03</span><h3>Get verified</h3><p>Receive a transparent score, skill breakdown and a shareable verification profile.</p><Link href="/verify">View verification →</Link></article>
        </div>
      </section>

      <section className="challenge-showcase"><div className="shell"><div className="section-top"><span>04 / CHALLENGES</span><h2>Built around the<br />work, not the quiz.</h2></div><div className="challenge-layout"><div className="skill-tabs">{skills.map((skill, i) => <button key={skill.name} className={activeSkill === i ? 'selected' : ''} onClick={() => setActiveSkill(i)}><span>0{i + 1}</span>{skill.name}<b>→</b></button>)}</div><div className="challenge-detail"><span className="detail-tag">{skills[activeSkill].level.toUpperCase()}</span><h3>{skills[activeSkill].name === 'Graphic Design' ? 'Create a launch campaign' : skills[activeSkill].name === 'Video Editing' ? 'Turn raw footage into a 30s reel' : 'Build a responsive product card'}</h3><p>Complete a realistic client-style brief. Your result is evaluated against a visible rubric covering quality, accuracy, execution and reasoning.</p><div className="detail-meta"><span>TIME <b>{activeSkill === 1 ? '60' : '45'} MIN</b></span><span>BENCHMARK <b>{skills[activeSkill].score}/100</b></span><Link href="/challenges">Open library ↗</Link></div></div></div></div></section>

      <section className="dark-proof"><div className="shell dark-grid"><div><span>05 / THE SCORE</span><h2>No black box.<br /><em>Just evidence.</em></h2><p>Every score has a rubric behind it. Candidates understand their result; employers understand the signal.</p><Link href="/trial" className="dark-button">See the product →</Link></div><div className="rubric-ui"><div className="rubric-title"><b>Graphic Design / Intermediate</b><strong>91</strong></div>{[['Execution','96'],['Visual hierarchy','93'],['Brief accuracy','88'],['Process & reasoning','87']].map(([label, score]) => <div className="rubric-line" key={label}><div><span>{label}</span><b>{score}</b></div><i style={{ width: `${score}%` }} /></div>)}<small>AI-assisted review · transparent rubric</small></div></div></section>

      <section className="hiring-section shell" id="hiring"><div className="section-top"><span>06 / FOR EMPLOYERS</span><h2>Hire the person<br />who can <em>actually do it.</em></h2></div><div className="hiring-grid"><div className="hiring-copy"><p>Search by demonstrated skill, compare verified scores and inspect proof before starting the interview.</p><Link href="/employers" className="black-button">Explore hiring <b>↗</b></Link></div><div className="candidate-ui"><div className="candidate-toolbar"><span>GRAPHIC DESIGNER</span><b>3 verified matches</b></div>{candidates.map(([initials, name, skill, score]) => <div className="candidate-row" key={name}><span className="candidate-avatar">{initials}</span><div><b>{name}</b><small>{skill} · Verified</small></div><strong>{score}</strong><button onClick={() => notify(`${name}'s proof opened.`)}>View</button></div>)}<div className="candidate-footer">Score 85+ · Verified · Photoshop</div></div></div></section>

      <section className="numbers"><div className="shell numbers-grid"><div><small>01</small><b>Real work</b><span>Practical assessments</span></div><div><small>02</small><b>Clear score</b><span>Visible evaluation</span></div><div><small>03</small><b>Public proof</b><span>One shareable profile</span></div><div><small>04</small><b>Better hiring</b><span>Skill-first discovery</span></div></div></section>

      <section className="pricing-new shell" id="pricing"><div className="section-top"><span>07 / PRICING</span><h2>Simple from day one.</h2></div><div className="price-row"><article><span>FREE</span><h3>Candidate</h3><strong>৳0</strong><p>Start building your first proof.</p><Link href="/pricing">Get started →</Link></article><article className="price-main"><span>PRO</span><h3>Candidate Pro</h3><strong>৳199<small>/mo</small></strong><p>More skills, attempts and detailed evidence.</p><Link href="/pricing">Join waitlist →</Link></article><article><span>HIRING</span><h3>Employer</h3><strong>৳499<small>/mo</small></strong><p>Search and shortlist verified candidates.</p><Link href="/pricing">Explore hiring →</Link></article></div></section>

      <section className="final-new"><div className="shell"><span>08 / START HERE</span><h2>Your next opportunity<br />should see your <em>work.</em></h2><div><Link href="/trial" className="lime-button">Try SkillProof <b>↗</b></Link><button onClick={() => notify('Early access request noted.')}>Get early access</button></div></div></section>

      <footer className="new-footer shell"><div><Link href="/" className="logo"><span>S</span> skillproof</Link><p>Proof over promises.</p></div><div className="footer-nav"><div><b>Product</b><Link href="/trial">Trial</Link><Link href="/challenges">Challenges</Link><Link href="/verify">Verify</Link></div><div><b>Teams</b><Link href="/employers">Employers</Link><Link href="/pricing">Pricing</Link></div><div><b>Company</b><a href="#product">About</a><a href="#product">Contact</a></div></div><div className="footer-bottom"><span>© 2026 SkillProof</span><span>Built for skill-first hiring.</span></div></footer>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
