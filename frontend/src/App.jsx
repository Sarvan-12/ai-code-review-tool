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

  /**
   * Handles the form submission to the backend API.
   * Sends code and language to /api/review and updates state with results.
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // Reset state before new request
    setIsProcessing(true);
    setErrorMessage('');
    setReviewData(null);

    try {
      // POST request to the local backend (proxied via Vite)
      const response = await axios.post('/api/review', {
        code: sourceCode,
        language
      });

      setReviewData(response.data);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 200);
    } catch (err) {
      // Extract error message from axios error object
      const errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
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
          <div className="error-box">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Form for Code Submission */}
        <CodeInput
          code={sourceCode}
          setCode={setSourceCode}
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
