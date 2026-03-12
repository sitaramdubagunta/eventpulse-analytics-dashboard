

import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import api from '../services/api';


export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [csvName, setCsvName] = useState('');
  const [message, setMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvName(file.name);
      setMessage('Uploading...');
      try {
        const formData = new FormData();
        formData.append('file', file);
        await api.post('/upload/csv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('CSV uploaded successfully!');
        setShowInstructions(false);
        // Optionally redirect to dashboard after upload:
        // setTimeout(() => navigate('/'), 1200);
      } catch (err) {
        setMessage('Upload failed: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  // Auto-open file dialog if navigated from sidebar or after signup
  useEffect(() => {
    if (location.state?.uploadCsv) {
      setTimeout(() => handleUploadClick(), 200); // slight delay for mount
    }
  }, [location.state]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 max-w-lg mx-auto mt-10">
      <div className="text-2xl font-bold text-slate-700 mb-4">Welcome to EventPulse!</div>
      {showInstructions && (
        <div className="mb-6 text-slate-600">
          <p className="mb-2">To get started, please upload your analytics CSV file. This is required to view your dashboard and analytics.</p>
          <p className="mb-2">You can change or re-upload your CSV at any time from this page.</p>
        </div>
      )}
      <div className="mb-4">
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          {csvName ? 'Change CSV File' : 'Upload CSV File'}
        </button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {csvName && <div className="mt-2 text-slate-600">Selected: {csvName}</div>}
        {message && <div className="mt-1 text-green-600">{message}</div>}
      </div>
      <div className="text-slate-500">Settings and CSV upload.</div>
    </div>
  );
}
