import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ReviewResult from './components/ReviewResult';
import './App.css';

/**
 * Main Application Component
 * Manages the state for code review requests and orchestrates the UI flow.
 */
function App() {
  // ─── State Management ────────────────────────────────────────────────────────
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [reviewData, setReviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState(null);

  /**
   * Handles the form submission to the backend API.
   * Sends code and language to /api/review and updates state with results.
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Reset state before new request
    setIsProcessing(true);
    setErrorMessage('');
    setErrorType(null);
    setReviewData(null);

    try {
      // POST request to the local backend (proxied via Vite)
      const response = await axios.post('/api/review', {
        code: sourceCode,
        language
      }, { timeout: 30000 });

      setReviewData(response.data);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 200);
    } catch (err) {
      const status = err.response?.status;
      let errorMsg = '';
      let type = 'generic';
      
      if (err.code === 'ECONNABORTED' || (err.message && err.message.toLowerCase().includes('timeout'))) {
        errorMsg = 'The AI is taking too long to respond. Please try again.';
        type = 'timeout';
      } else if (!err.response) {
        errorMsg = 'Network error — please check your internet connection and try again.';
        type = 'network';
      } else if (status === 400) {
        errorMsg = 'Invalid input — check your code and try again';
        type = 'client';
      } else if (status === 429) {
        errorMsg = 'Too many requests — please wait a moment before trying again';
        type = 'client';
      } else if (status >= 500) {
        errorMsg = 'Something went wrong on the server — try again in a few seconds';
        type = 'server';
      } else {
        errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred';
      }
      
      setErrorMessage(errorMsg);
      setErrorType(type);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      {/* Page Header */}
      <Header />

      <main>
        {/* Error Display */}
        {errorMessage && (
          <div className={`error-box error-${errorType || 'generic'}`}>
            <div className="error-content">
              <strong>{errorType === 'timeout' ? 'Timeout:' : 'Error:'}</strong> {errorMessage}
            </div>
            <button className="btn btn-retry" onClick={handleReviewSubmit}>
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Form for Code Submission */}
        <CodeInput
          code={sourceCode}
          setCode={(newCode) => {
            setSourceCode(newCode);
            setReviewData(null);
          }}
          language={language}
          setLanguage={setLanguage}
          onSubmit={handleReviewSubmit}
          isLoading={isProcessing}
        />

        {/* Display Results when available */}
        {reviewData && (
          <div id="result-section">
            <ReviewResult result={reviewData} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
