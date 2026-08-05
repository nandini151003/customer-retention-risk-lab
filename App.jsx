import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownToLine, ArrowRight, BarChart3, BrainCircuit,
  Check, ChevronRight, CircleHelp, Database, Eye, Gauge, HeartHandshake,
  LockKeyhole, Menu, ShieldCheck, Sparkles, Target, Users, X,
} from 'lucide-react'
import { distribution, governance, profiles, thresholdCurve, validation } from './data/modelData.js'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const logistic = (value) => 1 / (1 + Math.exp(-value))

function scoreProfile(profile) {
  const contributions = [
    {
      label: 'Contract flexibility',
      value: profile.contract === 'month-to-month' ? 0.88 : profile.contract === 'one-year' ? -0.18 : -0.56,
      detail: profile.contract === 'month-to-month' ? 'Month-to-month relationship' : 'Longer-term commitment',
    },
    {
      label: 'Relationship age',
      value: profile.tenure < 6 ? 0.72 : profile.tenure < 18 ? 0.24 : -0.38,
      detail: `${profile.tenure} months of tenure`,
    },
    {
      label: 'Installation experience',
      value: (profile.installationDelay - 4) * 0.045,
      detail: `${profile.installationDelay} day setup delay`,
    },
    {
      label: 'Support friction',
      value: (profile.supportTouches - 1) * 0.19,
      detail: `${profile.supportTouches} recent support touchpoints`,
    },
    {
      label: 'Payment continuity',
      value: profile.autopay ? -0.42 : 0.18,
      detail: profile.autopay ? 'Autopay enabled' : 'Manual payment',
    },
    {
      label: 'Engagement health',
      value: (55 - profile.engagement) * 0.022,
      detail: `${profile.engagement} engagement index`,
    },
  ]
  const logit = -1.12 + contributions.reduce((sum, item) => sum + item.value, 0)
  const probability = Math.round(logistic(logit) * 100)
  return {
    probability,
    contributions: [...contributions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)),
  }
}

function RiskGauge({ probability, threshold }) {
  const circumference = 251.2
  const offset = circumference * (1 - probability / 100)
  const tone = probability >= 70 ? 'critical' : probability >= threshold ? 'watch' : 'steady'
  return (
    <div className={`risk-gauge ${tone}`} aria-label={`Estimated cancellation risk ${probability} percent`}>
      <svg viewBox="0 0 112 112" role="img">
        <circle className="gauge-track" cx="56" cy="56" r="40" />
        <circle className="gauge-progress" cx="56" cy="56" r="40" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-value"><strong>{probability}%</strong><span>risk estimate</span></div>
    </div>
  )
}

function DistributionChart({ threshold }) {
  const max = Math.max(...distribution.map((item) => item.count))
  return (
    <div className="distribution-chart" role="img" aria-label="Synthetic customer risk score distribution">
      {distribution.map((item) => (
        <div className="bar-column" key={item.score}>
          <span className="bar-count">{item.count}</span>
          <div className={`bar ${item.score >= threshold ? 'selected' : ''}`} style={{ height: `${(item.count / max) * 100}%` }} />
          <span>{item.score}</span>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [profile, setProfile] = useState(profiles.watch)
  const [activeProfile, setActiveProfile] = useState('watch')
  const [threshold, setThreshold] = useState(45)
  const [methodOpen, setMethodOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const score = useMemo(() => scoreProfile(profile), [profile])
  const operatingPoint = thresholdCurve.find((item) => item.threshold === threshold) || thresholdCurve[3]
  const band = score.probability >= 70 ? 'High priority' : score.probability >= threshold ? 'Review' : 'Monitor'

  function applyProfile(key) {
    setActiveProfile(key)
    setProfile(profiles[key])
  }

  function update(field, value) {
    setActiveProfile('custom')
    setProfile((current) => ({ ...current, [field]: value }))
  }

  function exportAssessment() {
    const payload = {
      notice: 'Synthetic demonstration only. Not a production customer decision.',
      inputs: profile,
      estimatedRisk: score.probability,
      reviewBand: band,
      operatingThreshold: threshold,
      leadingDrivers: score.contributions.slice(0, 3).map(({ label, value, detail }) => ({ label, direction: value >= 0 ? 'raises risk' : 'reduces risk', detail })),
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'retainscope-synthetic-assessment.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="RetainScope home">
          <span className="brand-mark"><HeartHandshake size={19} /></span>
          <span>RetainScope</span>
        </a>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <a href="#sandbox" onClick={() => setMenuOpen(false)}>Risk sandbox</a>
          <a href="#threshold" onClick={() => setMenuOpen(false)}>Threshold lab</a>
          <a href="#governance" onClick={() => setMenuOpen(false)}>Governance</a>
          <button className="nav-button" onClick={() => setMethodOpen(true)}>Methodology</button>
        </nav>
        <div className="header-actions">
          <span className="privacy-pill"><LockKeyhole size={14} /> Synthetic data only</span>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> Explainable machine learning case study</div>
            <h1>Find retention risk early. Keep the decision human.</h1>
            <p className="hero-lede">A transparent logistic regression framework that turns pre-outcome customer signals into a focused, reviewable outreach queue.</p>
            <div className="hero-buttons">
              <a className="button primary" href="#sandbox">Try the live model <ArrowRight size={17} /></a>
              <button className="button secondary" onClick={() => setMethodOpen(true)}><CircleHelp size={17} /> How it works</button>
            </div>
            <div className="trust-row">
              <span><ShieldCheck size={17} /> Privacy-safe</span>
              <span><Eye size={17} /> Explainable</span>
              <span><Users size={17} /> Human reviewed</span>
            </div>
          </div>
          <aside className="hero-card">
            <div className="hero-card-top">
              <span>Model readiness</span><span className="status-dot">Portfolio prototype</span>
            </div>
            <div className="model-pulse">
              <div className="pulse-icon"><BrainCircuit size={26} /></div>
              <div><strong>Logistic regression</strong><span>Interpretable binary classifier</span></div>
            </div>
            <div className="mini-metrics">
              <div><strong>0.76</strong><span>ROC AUC</span></div>
              <div><strong>4</strong><span>Control layers</span></div>
              <div><strong>0</strong><span>Real identities</span></div>
            </div>
            <p className="micro-note">Illustrative validation metrics and synthetic records. No company performance is represented.</p>
          </aside>
        </section>

        <section className="principle-strip">
          <div className="section-shell principle-inner">
            <span className="principle-number">01</span>
            <div><span className="eyebrow light">Project thesis</span><h2>Predict earlier. Intervene thoughtfully.</h2></div>
            <p>The score helps a retention team decide where to look. It never decides how a customer should be treated.</p>
          </div>
        </section>

        <section id="sandbox" className="section-shell section-block">
          <div className="section-heading split-heading">
            <div><span className="eyebrow">Interactive risk sandbox</span><h2>Change the context. Watch the risk move.</h2></div>
            <p>Choose a synthetic profile or adjust the inputs. Every score is calculated in your browser.</p>
          </div>

          <div className="sandbox-grid">
            <div className="input-panel panel">
              <div className="profile-tabs" role="group" aria-label="Synthetic profile presets">
                {Object.entries(profiles).map(([key, item]) => (
                  <button key={key} className={activeProfile === key ? 'active' : ''} onClick={() => applyProfile(key)}>{item.label}</button>
                ))}
              </div>
              <div className="field-grid">
                <label className="field"><span>Contract type</span>
                  <select value={profile.contract} onChange={(e) => update('contract', e.target.value)}>
                    <option value="month-to-month">Month to month</option><option value="one-year">One year</option><option value="two-year">Two year</option>
                  </select>
                </label>
                <label className="field"><span>Autopay</span>
                  <select value={profile.autopay ? 'yes' : 'no'} onChange={(e) => update('autopay', e.target.value === 'yes')}>
                    <option value="yes">Enabled</option><option value="no">Not enabled</option>
                  </select>
                </label>
                <label className="field slider-field"><span>Relationship age <strong>{profile.tenure} months</strong></span>
                  <input type="range" min="1" max="60" value={profile.tenure} onChange={(e) => update('tenure', Number(e.target.value))} />
                </label>
                <label className="field slider-field"><span>Installation delay <strong>{profile.installationDelay} days</strong></span>
                  <input type="range" min="0" max="30" value={profile.installationDelay} onChange={(e) => update('installationDelay', Number(e.target.value))} />
                </label>
                <label className="field slider-field"><span>Support touchpoints <strong>{profile.supportTouches}</strong></span>
                  <input type="range" min="0" max="10" value={profile.supportTouches} onChange={(e) => update('supportTouches', Number(e.target.value))} />
                </label>
                <label className="field slider-field"><span>Engagement index <strong>{profile.engagement}</strong></span>
                  <input type="range" min="0" max="100" value={profile.engagement} onChange={(e) => update('engagement', Number(e.target.value))} />
                </label>
              </div>
            </div>

            <div className="score-panel panel">
              <div className="panel-kicker"><Activity size={16} /> Live synthetic estimate</div>
              <div className="score-summary">
                <RiskGauge probability={score.probability} threshold={threshold} />
                <div className="band-copy"><span>Review band</span><strong>{band}</strong><p>{band === 'High priority' ? 'Prompt human review and diagnose the friction before outreach.' : band === 'Review' ? 'Add to the review queue and confirm context before action.' : 'Continue the standard lifecycle cadence and monitor changes.'}</p></div>
              </div>
              <div className="driver-list">
                <div className="driver-heading"><span>Leading score drivers</span><span>direction</span></div>
                {score.contributions.slice(0, 4).map((driver) => (
                  <div className="driver" key={driver.label}>
                    <div><strong>{driver.label}</strong><span>{driver.detail}</span></div>
                    <span className={driver.value >= 0 ? 'risk-up' : 'risk-down'}>{driver.value >= 0 ? 'Raises risk' : 'Reduces risk'}</span>
                  </div>
                ))}
              </div>
              <button className="export-button" onClick={exportAssessment}><ArrowDownToLine size={17} /> Download this synthetic assessment</button>
            </div>
          </div>
        </section>

        <section id="threshold" className="threshold-section">
          <div className="section-shell section-block">
            <div className="section-heading split-heading inverse">
              <div><span className="eyebrow light">Threshold lab</span><h2>A threshold is a capacity decision.</h2></div>
              <p>Lower thresholds find more potential cancellations. They also create a larger queue and more false alarms.</p>
            </div>
            <div className="threshold-grid">
              <div className="threshold-control panel dark-panel">
                <div className="threshold-value"><span>Review threshold</span><strong>{threshold}%</strong></div>
                <input aria-label="Review threshold" type="range" min="30" max="70" step="5" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
                <div className="range-labels"><span>More coverage</span><span>More precision</span></div>
                <div className="operating-metrics">
                  <div><Users size={18} /><strong>{operatingPoint.queue}</strong><span>accounts queued</span></div>
                  <div><Target size={18} /><strong>{operatingPoint.recall}%</strong><span>estimated recall</span></div>
                  <div><Gauge size={18} /><strong>{operatingPoint.precision}%</strong><span>estimated precision</span></div>
                </div>
              </div>
              <div className="distribution-panel panel dark-panel">
                <div className="chart-heading"><div><span>Synthetic portfolio</span><strong>Risk score distribution</strong></div><span className="chart-key"><i /> In review queue</span></div>
                <DistributionChart threshold={threshold} />
                <div className="chart-axis">Estimated cancellation risk (%)</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-block">
          <div className="section-heading"><span className="eyebrow">Validation scorecard</span><h2>Accuracy alone is not enough.</h2><p>Each metric answers a different operating question. All values below are illustrative portfolio metrics.</p></div>
          <div className="validation-grid">
            {validation.map((item, index) => <article key={item.label}><span>0{index + 1}</span><strong>{item.value}</strong><h3>{item.label}</h3><p>{item.note}</p></article>)}
          </div>
          <div className="leakage-callout"><div className="callout-icon"><ShieldCheck /></div><div><span className="eyebrow">Leakage check</span><h3>Do not train on the answer in disguise.</h3><p>Cancellation status, post-cancellation monitoring states, and fields updated after the scoring moment stay outside the feature set.</p></div></div>
        </section>

        <section id="governance" className="governance-section">
          <div className="section-shell governance-grid">
            <div className="governance-copy"><span className="eyebrow">Privacy and governance</span><h2>Built for responsible public sharing.</h2><p>The portfolio edition is rebuilt with synthetic records, generic feature categories, and scrubbed document metadata. Raw company records remain outside the repository.</p>
              <a className="text-link" href="https://github.com/nandini151003/customer-retention-risk-lab/blob/main/docs/privacy.md">Read the privacy design <ChevronRight size={16} /></a>
            </div>
            <div className="governance-list">
              {governance.map(([title, detail]) => <div key={title}><span><Check size={15} /></span><div><strong>{title}</strong><p>{detail}</p></div></div>)}
            </div>
          </div>
        </section>

        <section className="section-shell source-section">
          <div className="source-copy"><span className="eyebrow">Source work</span><h2>The original case study, packaged safely.</h2><p>Explore the full public case study, model card, reproducible Python pipeline, synthetic sample, and extracted source visual.</p>
            <div className="source-links"><a className="button primary" href="https://github.com/nandini151003/customer-retention-risk-lab">View repository <ArrowRight size={17} /></a><a className="button secondary" href="https://github.com/nandini151003/customer-retention-risk-lab/blob/main/docs/customer-retention-risk-case-study.docx">Open case study</a></div>
          </div>
          <figure className="source-figure"><img src={`${import.meta.env.BASE_URL}assets/synthetic-risk-distribution.png`} alt="Synthetic risk score distribution from the original portfolio case study" /><figcaption>Original portfolio visual. Synthetic values only.</figcaption></figure>
        </section>
      </main>

      <footer><div className="section-shell"><div className="brand"><span className="brand-mark"><HeartHandshake size={18} /></span><span>RetainScope</span></div><p>Explainable retention intelligence with synthetic data and human oversight.</p><span>Built by Nandini Malik</span></div></footer>

      {methodOpen && <div className="drawer-backdrop" onClick={() => setMethodOpen(false)}><aside className="method-drawer" onClick={(e) => e.stopPropagation()} aria-label="Model methodology"><button className="drawer-close" onClick={() => setMethodOpen(false)} aria-label="Close methodology"><X /></button><span className="eyebrow">Model methodology</span><h2>Transparent by design</h2><p>RetainScope demonstrates an interpretable logistic regression pipeline using synthetic customer records.</p>
        <div className="method-step"><span>01</span><div><strong>Define the scoring moment</strong><p>Use only information intended to exist before a cancellation decision.</p></div></div>
        <div className="method-step"><span>02</span><div><strong>Prepare features in one pipeline</strong><p>Impute missing values, one-hot encode categories, and standardize numerical fields.</p></div></div>
        <div className="method-step"><span>03</span><div><strong>Estimate and explain risk</strong><p>Return a probability and show the strongest directional feature contributions.</p></div></div>
        <div className="method-step"><span>04</span><div><strong>Connect score to review</strong><p>Choose thresholds using recall, precision, capacity, and customer experience.</p></div></div>
        <div className="formula"><span>Logistic probability</span><code>p = 1 / (1 + e^(-z))</code><small>Where z is the intercept plus weighted feature contributions.</small></div>
        <a className="button primary wide" href="https://github.com/nandini151003/customer-retention-risk-lab/blob/main/model/train.py">View training pipeline <ArrowRight size={17} /></a>
      </aside></div>}
    </>
  )
}

export default App
