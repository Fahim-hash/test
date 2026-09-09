'use client';

import { useState } from 'react';

const skills = [
  ['PS', 'Photoshop', '91'],
  ['AI', 'Illustrator', '88'],
  ['UI', 'Social Design', '94'],
];

const challengeSamples = [
  { tag: 'Graphic Design', title: 'Design a launch campaign', time: '45 min', level: 'Intermediate', score: '94' },
  { tag: 'Video Editing', title: 'Turn raw footage into a 30s reel', time: '60 min', level: 'Intermediate', score: '89' },
  { tag: 'Web Development', title: 'Build a responsive product card', time: '50 min', level: 'Advanced', score: '92' },
];

const faqs = [
  ['Is SkillProof a replacement for a CV?', 'No. Your CV gives context; SkillProof adds evidence. Candidates can use both together.'],
  ['How are scores calculated?', 'Each challenge uses a visible rubric covering execution, accuracy, problem solving, quality and consistency. AI assists the review; high-stakes verification can include human review.'],
  ['Can employers see my files?', 'Only what you choose to publish. You control which projects, scores and proof details appear on your public profile.'],
  ['What skills can I verify?', 'The platform starts with practical digital skills and can expand into development, marketing, sales, writing, spreadsheets and other measurable work.'],
];

function ScoreRing({ score = 91 }: { score?: number }) {
  return <div className="score-ring" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}</strong><span>/100</span></div></div>;
}

export default function Home() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  return (
    <main>
      <div className="announcement"><span>●</span> SkillProof Beta is opening soon <button onClick={() => notify('You are on the early-access list ✓')}>Get early access →</button></div>

      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="SkillProof home"><span className="brand-mark">S</span> SkillProof</a>
        <div className="nav-links"><a href="#how">How it works</a><a href="#challenges">Challenges</a><a href="#skills">Skills</a><a href="#employers">Employers</a><a href="#pricing">Pricing</a></div>
        <button className="btn ghost" onClick={() => notify('Sign-in will be available in the beta.')}>Sign in</button>
      </nav>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> THE CREDENTIAL FOR WHAT YOU CAN ACTUALLY DO</div>
          <h1>Don’t just show your CV.<br /><em>Prove your skill.</em></h1>
          <p>SkillProof turns ability into measurable, shareable evidence. Take practical challenges, submit real work, understand your score, and give employers something better than another list of claims.</p>
          <div className="hero-actions"><button className="btn primary" onClick={() => notify('Challenge mode selected — beta access coming soon.')}>Prove my skills <span>→</span></button><button className="btn text" onClick={() => { setRole('employer'); document.getElementById('employers')?.scrollIntoView({ behavior: 'smooth' }); }}>I’m hiring <span>↗</span></button></div>
          <div className="micro-proof"><span>✓ No degree required</span><span>✓ Practical tasks</span><span>✓ Shareable profile</span></div>
          <div className="trust"><div className="avatars"><i>F</i><i>A</i><i>N</i><i>R</i><i>+</i></div><span><b>1,200+</b> early professionals want skill-first hiring.</span></div>
        </div>
        <div className="proof-card-wrap">
          <div className="floating-tag top">✦ AI-ASSISTED</div>
          <div className="proof-card">
            <div className="card-top"><div className="profile"><div className="avatar">F</div><div><b>Fahim M.</b><span>Graphic Designer · Dhaka</span></div></div><span className="verified">✓ VERIFIED</span></div>
            <div className="score-area"><ScoreRing /><div><span className="label">OVERALL SKILL SCORE</span><h3>Excellent</h3><p>Top 8% in this skill</p></div></div>
            <div className="skill-list">{skills.map(([icon, name, score]) => <div className="skill" key={name}><span className="skill-icon">{icon}</span><div><b>{name}</b><div className="bar"><i style={{ width: `${score}%` }} /></div></div><strong>{score}</strong></div>)}</div>
            <div className="card-foot"><span>Verified Sep 09, 2026</span><span>SP · 8F42K</span></div>
          </div>
          <div className="floating-tag bottom">↗ Share proof</div>
          <div className="floating-note"><b>94%</b><span>Hiring match</span></div>
        </div>
      </section>

      <section className="stats"><div className="shell stat-grid"><div><strong>01</strong><span>Real-world challenges</span></div><div><strong>02</strong><span>Transparent scoring</span></div><div><strong>03</strong><span>Shareable proof profile</span></div><div><strong>04</strong><span>Skill-first hiring</span></div></div></section>

      <section id="how" className="section shell">
        <div className="section-heading"><div className="eyebrow"><span /> THE NEW CREDENTIAL</div><h2>Credentials tell a story.<br /><em>Proof tells the truth.</em></h2><p>Degrees, courses and CVs matter. But the clearest signal is still the work itself. SkillProof creates a common language for showing that work.</p></div>
        <div className="steps"><article><div className="step-number">01</div><span className="step-icon">⌁</span><h3>Take a challenge</h3><p>Choose a skill and level. Get a realistic task designed around work you might actually do.</p><small>45–90 minutes · timed or untimed</small></article><article><div className="step-number">02</div><span className="step-icon">□</span><h3>Show your work</h3><p>Upload the final output, process notes and optional source files. Context counts.</p><small>Work samples · reasoning · iterations</small></article><article><div className="step-number">03</div><span className="step-icon">✓</span><h3>Earn your proof</h3><p>See exactly where you scored well, where you can improve and what your profile proves.</p><small>Score · rubric · verification ID</small></article></div>
      </section>

      <section id="challenges" className="challenge-section"><div className="shell"><div className="section-heading"><div className="eyebrow"><span /> PRACTICAL CHALLENGE LIBRARY</div><h2>Not trivia. <em>Actual work.</em></h2><p>Every challenge is built around a realistic deliverable, not a memory test.</p></div><div className="challenge-grid">{challengeSamples.map((c) => <article className="challenge-card" key={c.title}><div className="challenge-top"><span>{c.tag}</span><b>↗</b></div><h3>{c.title}</h3><div className="challenge-meta"><span>◷ {c.time}</span><span>◆ {c.level}</span></div><div className="challenge-bottom"><span>Sample benchmark</span><strong>{c.score}/100</strong></div></article>)}</div></div></section>

      <section id="skills" className="dark-section"><div className="shell skill-banner"><div><div className="eyebrow light"><span /> BUILT FOR REAL SKILLS</div><h2>From Photoshop to Python.<br /><em>Prove what you know.</em></h2><p>Start narrow, build deeply, then expand. Each skill gets its own challenge library, rubric and benchmark.</p></div><div className="skill-pills"><span>Graphic Design</span><span>Video Editing</span><span>Web Development</span><span>Digital Marketing</span><span>Excel</span><span>Sales</span><span>Content Writing</span><span>UI/UX</span><span>Data Analysis</span><span>+ more</span></div></div></section>

      <section className="score-section shell"><div><div className="eyebrow"><span /> A SCORE YOU CAN UNDERSTAND</div><h2>No mysterious<br /><em>AI magic.</em></h2><p>See the rubric behind the number. SkillProof breaks performance into useful signals instead of handing you an unexplained percentage.</p><button className="btn primary" onClick={() => notify('Example rubric opened — detailed scoring is coming in beta.')}>See sample rubric <span>→</span></button></div><div className="rubric-card"><div className="rubric-head"><b>Graphic Design · Intermediate</b><span>91 / 100</span></div>{[['Execution', '96'], ['Visual hierarchy', '93'], ['Typography', '90'], ['Brief accuracy', '88'], ['Process & reasoning', '87']].map(([name, score]) => <div className="rubric-row" key={name}><div><span>{name}</span><b>{score}</b></div><div className="rubric-bar"><i style={{ width: `${score}%` }} /></div></div>)}<div className="rubric-foot">Last assessed · 12 min ago <span>VERIFICATION ID · 8F42K</span></div></div></section>

      <section id="employers" className="employer shell"><div className="employer-copy"><div className="eyebrow"><span /> FOR EMPLOYERS</div><h2>Stop filtering CVs.<br /><em>Start seeing ability.</em></h2><p>Compare candidates by demonstrated skill, inspect relevant proof and create hiring shortlists around what the role actually needs.</p><div className="role-switch"><button className={role === 'candidate' ? 'active' : ''} onClick={() => setRole('candidate')}>Candidate view</button><button className={role === 'employer' ? 'active' : ''} onClick={() => setRole('employer')}>Employer view</button></div><button className="btn primary" onClick={() => notify('Employer workspace requested.')}>Explore hiring <span>→</span></button></div><div className="hire-card"><div className="hire-head"><div><span className="tiny-label">OPEN ROLE</span><b>Graphic Designer</b></div><span>3 verified candidates</span></div><div className="filter-row"><span>Score: 85+</span><span>Photoshop</span><span>Verified</span></div>{[['A','Arif Rahman','Photoshop · Illustrator','94'],['S','Sadia K.','Photoshop · Social Design','91'],['R','Rafi H.','Illustrator · Branding','87']].map(([initial,name,skillsText,score]) => <div className="candidate" key={name}><span className="mini-avatar">{initial}</span><div><b>{name}</b><small>{skillsText}</small></div><strong>{score}</strong><button onClick={() => notify(`${name}'s proof profile opened.`)}>View</button></div>)}<div className="hire-foot">↗ Compare evidence · Export shortlist</div></div></section>

      <section id="pricing" className="pricing-section"><div className="shell"><div className="section-heading"><div className="eyebrow"><span /> SIMPLE BY DESIGN</div><h2>Start free. <em>Prove more.</em></h2><p>Keep the first step frictionless. Pay only when you need more verification or hiring power.</p></div><div className="pricing-grid"><article><span className="plan">CANDIDATE</span><h3>Free</h3><p>Build your first proof profile.</p><strong>৳0 <small>forever</small></strong><ul><li>1 verified skill</li><li>Basic challenges</li><li>Public proof profile</li><li>Shareable verification link</li></ul><button className="btn ghost" onClick={() => notify('Free candidate signup selected.')}>Get started</button></article><article className="featured"><span className="popular">MOST USEFUL</span><span className="plan">CANDIDATE PRO</span><h3>Pro</h3><p>For people serious about standing out.</p><strong>৳199 <small>/ month</small></strong><ul><li>Unlimited challenge attempts</li><li>Detailed skill breakdowns</li><li>Multiple verified skills</li><li>Private & public proof controls</li></ul><button className="btn primary" onClick={() => notify('Pro plan interest saved.')}>Join the waitlist <span>→</span></button></article><article><span className="plan">EMPLOYER</span><h3>Hiring</h3><p>For teams hiring skill-first.</p><strong>৳499 <small>/ month</small></strong><ul><li>Candidate search</li><li>Skill-based shortlists</li><li>Proof profile previews</li><li>Hiring workspace</li></ul><button className="btn ghost" onClick={() => notify('Employer plan interest saved.')}>Talk to us</button></article></div></div></section>

      <section className="faq-section shell"><div className="faq-intro"><div className="eyebrow"><span /> QUESTIONS, ANSWERED</div><h2>The boring details<br /><em>matter.</em></h2><p>Because trust lives in the tiny details too.</p></div><div className="faqs">{faqs.map(([q,a], i) => <div className={`faq ${openFaq === i ? 'open' : ''}`} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><b>{openFaq === i ? '−' : '+'}</b></button>{openFaq === i && <p>{a}</p>}</div>)}</div></section>

      <section className="final-cta"><div className="shell"><div className="eyebrow light"><span /> YOUR NEXT OPPORTUNITY SHOULD SEE MORE THAN A CV</div><h2>Make your ability<br /><em>impossible to ignore.</em></h2><div><button className="btn lime" onClick={() => notify('You are on the early-access list ✓')}>Get early access <span>→</span></button><button className="btn final-link" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>How it works ↗</button></div></div></section>

      <footer><div className="shell footer-inner"><div><a className="brand" href="#top"><span className="brand-mark">S</span> SkillProof</a><p>Proof over promises. Built for a more skill-first internet.</p></div><div className="footer-links"><div><b>Product</b><a href="#how">How it works</a><a href="#challenges">Challenges</a><a href="#skills">Skills</a></div><div><b>For teams</b><a href="#employers">Employers</a><a href="#pricing">Pricing</a><a href="#top">Early access</a></div><div><b>Company</b><a href="#top">About</a><a href="#top">Contact</a><a href="#top">Privacy</a></div></div><div className="footer-bottom"><span>© 2026 SkillProof</span><span>Made for people who can actually do the work.</span><span>SP · 8F42K · β</span></div></div></footer>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
