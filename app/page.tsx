const skills = [
  ['PS', 'Photoshop', '91'],
  ['AI', 'Illustrator', '88'],
  ['UI', 'Social Design', '94'],
];

function ScoreRing({ score = 91 }: { score?: number }) {
  return (
    <div className="score-ring" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <div className="brand"><span className="brand-mark">S</span> SkillProof</div>
        <div className="nav-links"><a href="#how">How it works</a><a href="#skills">Skills</a><a href="#employers">For employers</a></div>
        <button className="btn ghost">Sign in</button>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> SKILL VERIFICATION, REIMAGINED</div>
          <h1>Don’t just show your CV.<br /><em>Prove your skill.</em></h1>
          <p>SkillProof turns what you can do into trusted, measurable proof. Take practical challenges, get evaluated, and let your ability speak louder than your credentials.</p>
          <div className="hero-actions"><button className="btn primary">Prove my skills <span>→</span></button><button className="btn text">I’m hiring <span>↗</span></button></div>
          <div className="trust"><div className="avatars"><i>F</i><i>A</i><i>N</i><i>R</i></div><span>Join <b>1,200+</b> early professionals proving what they can do.</span></div>
        </div>
        <div className="proof-card-wrap">
          <div className="floating-tag top">✦ AI-VERIFIED</div>
          <div className="proof-card">
            <div className="card-top"><div className="profile"><div className="avatar">F</div><div><b>Fahim M.</b><span>Graphic Designer</span></div></div><span className="verified">✓ Verified</span></div>
            <div className="score-area"><ScoreRing /><div><span className="label">OVERALL SKILL SCORE</span><h3>Excellent</h3><p>Top 8% of verified designers</p></div></div>
            <div className="skill-list">{skills.map(([icon, name, score]) => <div className="skill" key={name}><span className="skill-icon">{icon}</span><div><b>{name}</b><div className="bar"><i style={{ width: `${score}%` }} /></div></div><strong>{score}</strong></div>)}</div>
            <div className="card-foot"><span>Verified Sep 09, 2026</span><span>SP · 8F42K</span></div>
          </div>
          <div className="floating-tag bottom">↗ Share your proof</div>
        </div>
      </section>

      <section className="stats"><div className="shell stat-grid"><div><strong>01</strong><span>Real-world challenges</span></div><div><strong>02</strong><span>AI-assisted evaluation</span></div><div><strong>03</strong><span>Shareable proof profile</span></div><div><strong>04</strong><span>Hire with confidence</span></div></div></section>

      <section id="how" className="section shell">
        <div className="section-heading"><div className="eyebrow"><span /> THE NEW CREDENTIAL</div><h2>Credentials tell a story.<br /><em>Proof tells the truth.</em></h2><p>Degrees and CVs are useful context. But when it comes to hiring, the most important question is simple: can they actually do the work?</p></div>
        <div className="steps"><article><b>01</b><h3>Take a challenge</h3><p>Get a realistic task designed around the skill and level you want to prove.</p></article><article><b>02</b><h3>Show your work</h3><p>Submit your solution, process, and reasoning. No trick questions. Just real work.</p></article><article><b>03</b><h3>Earn your proof</h3><p>Get a transparent score and a verified profile you can share anywhere.</p></article></div>
      </section>

      <section id="skills" className="dark-section"><div className="shell skill-banner"><div><div className="eyebrow light"><span /> BUILT FOR REAL SKILLS</div><h2>From Photoshop to Python.<br /><em>Prove what you know.</em></h2></div><div className="skill-pills"><span>Graphic Design</span><span>Video Editing</span><span>Web Development</span><span>Digital Marketing</span><span>Excel</span><span>Sales</span><span>Content Writing</span><span>+ more</span></div></div></section>

      <section id="employers" className="employer shell"><div className="employer-copy"><div className="eyebrow"><span /> FOR EMPLOYERS</div><h2>Stop filtering CVs.<br /><em>Start seeing ability.</em></h2><p>See standardized skill scores, practical work samples, and verified proof before you spend time interviewing.</p><button className="btn primary">Explore hiring <span>→</span></button></div><div className="hire-card"><div className="hire-head"><b>Graphic Designer</b><span>3 candidates</span></div><div className="candidate"><span className="mini-avatar">A</span><div><b>Arif Rahman</b><small>Photoshop · Illustrator</small></div><strong>94</strong></div><div className="candidate"><span className="mini-avatar">S</span><div><b>Sadia K.</b><small>Photoshop · Social Design</small></div><strong>91</strong></div><div className="candidate"><span className="mini-avatar">R</span><div><b>Rafi H.</b><small>Illustrator · Branding</small></div><strong>87</strong></div></div></section>

      <footer><div className="shell footer-inner"><div className="brand"><span className="brand-mark">S</span> SkillProof</div><span>© 2026 SkillProof. Hire ability, not credentials.</span><div><a href="#how">How it works</a><a href="#employers">Employers</a></div></div></footer>
    </main>
  );
}
