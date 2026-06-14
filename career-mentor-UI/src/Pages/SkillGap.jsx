import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SkillGap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/skills/gap')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">⏳ Analyzing your skills...</div>;
  if (error) return (
    <div>
      <div className="error-msg">{error}</div>
      <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => navigate('/')}>
        Upload Resume First
      </button>
    </div>
  );

  const percent = data?.readinessPercent || 0;

  return (
    <div>
      <div className="page-header">
        <h1>📊 Skill Gap Analysis</h1>
        <p>Target role: <strong style={{ color: '#667eea' }}>{data?.targetRole}</strong></p>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="label">Readiness</div>
          <div className="value">{percent}%</div>
          <div className="sub">job ready</div>
        </div>
        <div className="metric-card">
          <div className="label">Skills Matched</div>
          <div className="value">{data?.matched?.length || 0}</div>
          <div className="sub">of {data?.required?.length} required</div>
        </div>
        <div className="metric-card">
          <div className="label">Skills Missing</div>
          <div className="value" style={{ color: '#fc8181' }}>{data?.missing?.length || 0}</div>
          <div className="sub">to learn</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Overall Readiness</div>
        <div className="progress-wrap">
          <div className="progress-label">
            <span>Progress</span><span>{percent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">✅ Skills You Have</div>
        <div className="pills">
          {data?.matched?.map((s, i) => <span key={i} className="pill pill-green">{s}</span>)}
          {data?.matched?.length === 0 && <span style={{ color: '#718096', fontSize: 13 }}>No matching skills found yet</span>}
        </div>
      </div>

      <div className="card">
        <div className="section-title">❌ Skills to Learn</div>
        <div className="pills">
          {data?.missing?.map((s, i) => <span key={i} className="pill pill-red">{s}</span>)}
          {data?.missing?.length === 0 && <span style={{ color: '#68d391', fontSize: 13 }}>🎉 You have all required skills!</span>}
        </div>
      </div>

      <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => navigate('/roadmap')}>
        🗺️ Get Learning Roadmap →
      </button>
    </div>
  );
}