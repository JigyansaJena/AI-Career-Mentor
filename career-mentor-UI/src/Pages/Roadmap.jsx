import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Roadmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/skills/roadmap')
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (i) => setCompleted(prev => ({ ...prev, [i]: !prev[i] }));
  const doneCount = Object.values(completed).filter(Boolean).length;

  if (loading) return <div className="loading">⏳ Generating your personalized roadmap...</div>;
  if (error) return (
    <div>
      <div className="error-msg">{error}</div>
      <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => navigate('/')}>
        Upload Resume First
      </button>
    </div>
  );

  const roadmap = data?.roadmap || [];

  return (
    <div>
      <div className="page-header">
        <h1>🗺️ Learning Roadmap</h1>
        <p>Personalized plan to become a <strong style={{ color: '#667eea' }}>{data?.targetRole}</strong></p>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="label">Total Resources</div>
          <div className="value">{roadmap.length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Completed</div>
          <div className="value" style={{ color: '#68d391' }}>{doneCount}</div>
        </div>
        <div className="metric-card">
          <div className="label">Est. Hours</div>
          <div className="value">{roadmap.reduce((a, r) => a + (r.hours || 0), 0)}</div>
          <div className="sub">total</div>
        </div>
      </div>

      <div className="card">
        {roadmap.length === 0 && (
          <div style={{ color: '#718096', fontSize: 14 }}>No roadmap items generated yet.</div>
        )}
        {roadmap.map((item, i) => (
          <div key={i} className="roadmap-item" style={{ opacity: completed[i] ? 0.5 : 1 }}>
            <div className="road-icon">{completed[i] ? '✅' : '📚'}</div>
            <div className="road-body">
              <div className="road-title" style={{ textDecoration: completed[i] ? 'line-through' : 'none' }}>
                {item.skill}
              </div>
              <div className="road-sub">{item.resource}</div>
              <div className="road-meta">
                <span className={`tag ${item.priority === 'high' ? 'tag-high' : 'tag-med'}`}>
                  {item.priority} priority
                </span>
                <span className="tag">⏱ {item.hours}h</span>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: '#667eea', textDecoration: 'none' }}>
                    🔗 Resource
                  </a>
                )}
              </div>
            </div>
            <button onClick={() => toggle(i)} className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: 12, alignSelf: 'flex-start' }}>
              {completed[i] ? 'Undo' : 'Done'}
            </button>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => navigate('/interview')}>
        🎤 Practice Interview →
      </button>
    </div>
  );
}