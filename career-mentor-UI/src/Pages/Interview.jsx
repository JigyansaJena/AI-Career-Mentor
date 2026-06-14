import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Interview() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/interview/questions')
      .then(res => setQuestions(res.data.questions || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load questions'))
      .finally(() => setLoading(false));
  }, []);

  const submitAnswer = async (i) => {
    if (!answers[i]?.trim()) return;
    setSubmitting(prev => ({ ...prev, [i]: true }));
    try {
      const res = await api.post('/interview/answer', {
        question: questions[i],
        answer: answers[i]
      });
      setFeedbacks(prev => ({ ...prev, [i]: res.data }));
    } catch (err) {
      setFeedbacks(prev => ({ ...prev, [i]: { error: 'Failed to evaluate' } }));
    } finally {
      setSubmitting(prev => ({ ...prev, [i]: false }));
    }
  };

  const reload = () => {
    setLoading(true); setQuestions([]); setAnswers({}); setFeedbacks({});
    api.get('/interview/questions')
      .then(res => setQuestions(res.data.questions || []))
      .finally(() => setLoading(false));
  };

  const stars = (score) => '⭐'.repeat(score) + '☆'.repeat(5 - score);
  const avgScore = Object.values(feedbacks).filter(f => f.score).reduce((a, f, _, arr) => a + f.score / arr.length, 0);

  if (loading) return <div className="loading">⏳ Generating interview questions...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>🎤 Mock Interview</h1>
        <p>Answer all questions and get instant AI feedback</p>
      </div>

      {Object.keys(feedbacks).length > 0 && (
        <div className="metrics-row" style={{ marginBottom: 20 }}>
          <div className="metric-card">
            <div className="label">Answered</div>
            <div className="value">{Object.keys(feedbacks).length}/{questions.length}</div>
          </div>
          <div className="metric-card">
            <div className="label">Avg Score</div>
            <div className="value">{avgScore ? avgScore.toFixed(1) : '-'}<span style={{ fontSize: 14, color: '#718096' }}>/5</span></div>
          </div>
          <div className="metric-card">
            <div className="label">Status</div>
            <div className="value" style={{ fontSize: 16 }}>
              {Object.keys(feedbacks).length === questions.length ? '✅ Done' : '🔄 In Progress'}
            </div>
          </div>
        </div>
      )}

      {questions.map((q, i) => (
        <div key={i} className="question-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#667eea', fontWeight: 600 }}>Q{i + 1}</span>
            {feedbacks[i]?.score && <span style={{ fontSize: 13 }}>{stars(feedbacks[i].score)}</span>}
          </div>
          <div className="question-text">{q}</div>

          {!feedbacks[i] ? (
            <>
              <textarea
                className="answer-input"
                placeholder="Type your answer here..."
                value={answers[i] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
              />
              <button className="btn-primary" style={{ marginTop: 10 }}
                onClick={() => submitAnswer(i)} disabled={submitting[i] || !answers[i]?.trim()}>
                {submitting[i] ? '⏳ Evaluating...' : '📤 Submit Answer'}
              </button>
            </>
          ) : (
            <div className="feedback-box">
              <div className="score-stars">{stars(feedbacks[i].score)} {feedbacks[i].score}/5</div>
              <div className="feedback-text">{feedbacks[i].feedback}</div>
              {feedbacks[i].improvement && (
                <div className="improvement">💡 Tip: {feedbacks[i].improvement}</div>
              )}
            </div>
          )}
        </div>
      ))}

      <button className="btn-secondary" onClick={reload} style={{ marginTop: 8 }}>
        🔄 New Questions
      </button>
    </div>
  );
}