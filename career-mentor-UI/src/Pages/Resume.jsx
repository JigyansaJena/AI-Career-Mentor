import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Resume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') { setFile(f); setError(''); }
    else setError('Please select a PDF file');
  };

  const handleUpload = async () => {
    if (!file) return setError('Please select a PDF first');
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/resume/upload', formData);
      setResult(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📄 Resume Upload</h1>
        <p>Upload your resume and we'll extract your skills automatically</p>
      </div>

      <div className="card">
        <div className={`upload-zone ${file ? 'has-file' : ''}`} onClick={() => inputRef.current.click()}>
          <div className="upload-icon">{file ? '✅' : '📁'}</div>
          <div className="upload-text">{file ? file.name : 'Click to upload your resume PDF'}</div>
          <div className="upload-sub">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF only · max 5MB'}</div>
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFile} />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-primary" onClick={handleUpload} disabled={loading || !file}>
          {loading ? '⏳ Extracting skills...' : '🚀 Upload & Extract Skills'}
        </button>
      </div>

      {result && (
        <div className="card">
          <div className="success-box">✅ Resume uploaded successfully! Skills extracted.</div>
          <div style={{ marginTop: 16 }}>
            <div className="section-title">Extracted Skills ({result.extractedSkills?.length || 0})</div>
            <div className="pills">
              {result.extractedSkills?.map((skill, i) => (
                <span key={i} className="pill pill-blue">{skill}</span>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/skills')}>
            📊 View Skill Gap Analysis →
          </button>
        </div>
      )}
    </div>
  );
}