'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, Copy, ExternalLink, Instagram, Linkedin, Mail, Menu, X } from 'lucide-react';

const projects = [
  { number: '01', title: "Willian's Study Tour '26", type: 'Event Branding', year: '2026', description: 'A complete visual system for a high-energy study tour — identity, social campaign, merchandise and event communication.', tags: ['Branding', 'Campaign', 'Art Direction'], accent: 'violet', link: 'https://www.behance.net/gallery/243588815/Willians-Study-Tour-26-Full-Event-Branding' },
  { number: '02', title: 'TongerKhobor', type: 'Media Identity', year: '2026', description: 'A street-smart editorial identity built around the culture of the tong, designed to make local stories feel globally shareable.', tags: ['Identity', 'Editorial', 'Social'], accent: 'red', link: 'https://www.instagram.com/tongerkhobor' },
  { number: '03', title: 'Willes Literary Club', type: 'Digital Experience', year: '2026', description: 'A modern digital presence for a literature community, balancing editorial character with fast, accessible interactions.', tags: ['Web', 'UI', 'Community'], accent: 'amber', link: 'https://www.wlc.pro.bd' },
  { number: '04', title: 'Everglow Gems', type: 'Business System', year: '2026', description: 'A practical visual and operational system connecting product presentation, inventory and partner ordering into one workflow.', tags: ['Branding', 'Product', 'Automation'], accent: 'cyan', link: 'https://github.com/Fahim-hash/everglow-gems-app' },
];

const skills = ['Visual Identity', 'Graphic Design', 'Art Direction', 'Photo Manipulation', 'Social Campaigns', 'Motion Graphics', 'Video Editing', 'Photography', 'UI Design', 'Creative Coding'];

const software = [
  ['Adobe Illustrator', '90%'], ['Adobe Photoshop', '88%'], ['After Effects', '70%'], ['Premiere Pro', '68%'], ['Lightroom', '64%'], ['DaVinci Resolve', '48%']
];

const timeline = [
  ['2026', 'Dhaka University', 'English Department · Communication, literature & creative practice'],
  ['2025', 'EmissaryMUN', 'Creative & communications work for an international Model United Nations experience'],
  ['2024—25', 'Willes Literary Club', 'IT leadership, event systems, visual communication and digital initiatives'],
  ['Now', 'Independent', 'Designing identities, campaigns and digital products for people with something to say'],
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText('syedfahim.muddasir@gmail.com');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="logo"><span>F</span><b>FAHIM<span>.</span></b></a>
        <nav className={menu ? 'nav open' : 'nav'}>
          {['Work', 'About', 'Skills', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)}>{item}</a>)}
        </nav>
        <div className="header-right"><span className="available"><i /> Available for selected projects</span><a className="header-mail" href="mailto:syedfahim.muddasir@gmail.com"><Mail size={16} /></a><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button></div>
      </header>

      <section id="top" className="hero section-pad">
        <div className="hero-kicker"><span>SELECTED WORK · 2024—2026</span><span>01 / 05</span></div>
        <div className="hero-grid">
          <div>
            <h1>Design that<br /><em>feels like</em><br />something.</h1>
            <p className="hero-lede">I'm <strong>Syed Fahim Muddasir</strong> — a creative designer working across visual identity, campaigns, digital experiences and cinematic imagery.</p>
            <div className="hero-actions"><a className="button dark" href="#work">Explore selected work <ArrowDown size={17} /></a><a className="text-link" href="mailto:syedfahim.muddasir@gmail.com">Let's make something <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="hero-art" aria-label="Abstract creative artwork"><div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" /><div className="art-core">F<span>/</span>M</div><div className="art-label top-label">VISUAL<br />DIRECTION</div><div className="art-label bottom-label">DHAKA · BD<br />23°48′N</div></div>
        </div>
        <div className="hero-foot"><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span><span>BRAND · DIGITAL · MOTION · PHOTO</span></div>
      </section>

      <section className="manifesto section-pad"><div className="manifesto-index">02 / 05</div><div className="manifesto-copy"><p className="eyebrow">A LITTLE ABOUT THE APPROACH</p><h2>Good design gets attention.<br /><em>Great design gives it a reason.</em></h2><p className="body-copy">I like ideas that have a point of view. My work starts with the problem, finds the visual language, then pushes it until the smallest detail feels intentional. The goal isn't decoration — it's recognition, feeling and action.</p><div className="signature">Fahim<span>✦</span></div></div></section>

      <section id="work" className="work section-pad"><div className="section-head"><div><p className="eyebrow">03 / 05 · SELECTED WORK</p><h2>Things I've <em>made.</em></h2></div><p>Brand systems, campaigns and digital products built with equal parts curiosity and obsession.</p></div><div className="project-list">{projects.map((project) => <a className={`project ${project.accent}`} href={project.link} target="_blank" rel="noreferrer" key={project.number}><div className="project-visual"><div className="visual-no">{project.number}</div><div className="visual-shape" /><span className="visual-caption">{project.type.toUpperCase()}</span><ExternalLink className="visual-arrow" size={21} /></div><div className="project-info"><div className="project-meta"><span>{project.type}</span><span>{project.year}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></a>)}</div></section>

      <section id="skills" className="skills section-pad"><div className="skills-top"><div><p className="eyebrow">04 / 05 · CAPABILITIES</p><h2>Wide range.<br /><em>Sharp taste.</em></h2></div><p>I move between disciplines when the idea needs it. That's the advantage of being both a visual designer and a builder.</p></div><div className="skill-cloud">{skills.map((skill, i) => <span key={skill} className={i % 4 === 0 ? 'featured-skill' : ''}>{skill}</span>)}</div><div className="software"><div className="software-head"><span>TOOLS I USE</span><span>CONFIDENCE · NOT CERTIFICATION</span></div>{software.map(([name, level]) => <div className="software-row" key={name}><span>{name}</span><div><i style={{ width: level }} /></div><b>{level}</b></div>)}</div></section>

      <section id="about" className="about section-pad"><div className="about-title"><p className="eyebrow">05 / 05 · THE LONGER STORY</p><h2>Curious by<br /><em>default.</em></h2></div><div className="about-content"><p className="large-copy">Design is where my interests collide: English, storytelling, technology, photography, music, culture and a slightly unhealthy attention to detail.</p><div className="timeline">{timeline.map(([date, title, detail]) => <div className="timeline-row" key={date + title}><span className="timeline-date">{date}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div></div></section>

      <section className="testimonial"><div className="quote-mark">“</div><blockquote>Fahim's work stands out because he doesn't just design — he thinks about the system behind the design.</blockquote><div className="quote-by"><span>Mohammad Nasir</span><small>ScienceBaze</small></div></section>

      <section id="contact" className="contact section-pad"><div className="contact-grid"><div><p className="eyebrow">LET'S TALK</p><h2>Have a good<br /><em>idea?</em></h2></div><div className="contact-side"><p>For branding, campaign design, creative direction or digital work, send me the brief. If the idea is interesting, I'll reply.</p><div className="email-line"><a href="mailto:syedfahim.muddasir@gmail.com">syedfahim.muddasir@gmail.com</a><button onClick={copyEmail} aria-label="Copy email">{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><div className="socials"><a href="https://www.behance.net/fahimmuddasir" target="_blank" rel="noreferrer">Behance <ArrowUpRight size={14} /></a><a href="https://www.instagram.com/mr_relax_bro" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a><a href="https://www.linkedin.com" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a></div></div></div></section>

      <footer><div className="footer-main"><a href="#top" className="logo"><span>F</span><b>FAHIM<span>.</span></b></a><p>Visual designer · storyteller · builder</p><a className="back-top" href="#top">Back to top <ArrowUpRight size={14} /></a></div><div className="footer-bottom"><span>© 2026 Syed Fahim Muddasir</span><span>Dhaka, Bangladesh</span><span>Made with intent.</span></div></footer>
    </main>
  );
}
