'use client';
import { useState } from 'react';
import TrialShell from '../components/TrialShell';

type Plan = { name: string; price: string; period: string; description: string; features: string[] };
const plans: Plan[] = [
  { name: 'Free', price: '৳0', period: 'forever', description: 'For getting your first proof.', features: ['1 verified skill', 'Basic challenges', 'Public proof profile', 'Verification link'] },
  { name: 'Pro', price: '৳199', period: '/ month', description: 'For candidates who want a stronger signal.', features: ['Unlimited attempts', 'Detailed breakdowns', 'Multiple skills', 'Advanced profile controls'] },
  { name: 'Hiring', price: '৳499', period: '/ month', description: 'For teams hiring skill-first.', features: ['Candidate search', 'Skill filters', 'Proof previews', 'Hiring workspace'] },
];

export default function Pricing() {
  const [selected, setSelected] = useState('');
  return (
    <TrialShell title="Pricing without the fine print." kicker="PLANS & BILLING">
      <div className="trial-grid">
        {plans.map((plan, i) => (
          <article className="trial-card" key={plan.name} style={i === 1 ? { background: '#10100f', color: '#fff', transform: 'translateY(-8px)' } : {}}>
            <span className="trial-tag">{i === 1 ? 'MOST POPULAR' : 'PLAN'}</span>
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <strong style={{ font: '700 32px DM Mono', display: 'block', margin: '20px 0' }}>{plan.price} <small style={{ fontSize: 9, color: '#999' }}>{plan.period}</small></strong>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {plan.features.map((feature) => <li key={feature} style={{ padding: '12px 0', borderTop: '1px solid #444', fontSize: 10 }}>✓ {feature}</li>)}
            </ul>
            <button className={`trial-btn ${i === 1 ? 'lime' : 'light'}`} style={{ width: '100%', marginTop: 12 }} onClick={() => setSelected(plan.name)}>{selected === plan.name ? 'Selected ✓' : `Choose ${plan.name}`}</button>
          </article>
        ))}
      </div>
      <div className="trial-card" style={{ marginTop: 15 }}>
        <span className="trial-tag">TRIAL BILLING</span>
        <h3>No payment is connected.</h3>
        <p>Every pricing action is simulated in this trial build. No card, subscription, invoice or real account is created.</p>
        <div className="trial-grid">
          {['Cancel anytime', 'No hidden setup fee', 'Upgrade/downgrade demo', 'Transparent limits'].map((item) => <div className="trial-stat" key={item}><strong style={{ fontSize: 16 }}>✓ {item}</strong><small>Included in the product design</small></div>)}
        </div>
      </div>
    </TrialShell>
  );
}
