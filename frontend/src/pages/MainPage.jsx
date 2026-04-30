import { useState } from 'react';
import axios from 'axios';
import CodeInput from '../components/CodeInput';
import ReviewResult from '../components/ReviewResult';

/**
 * MainPage component — handles the code review form and displays results.
 * Contains all state and submit logic for the review flow.
 */
function MainPage() {
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('C');
  const [reviewData, setReviewData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState(null);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);
    setErrorMessage('');
    setErrorType(null);
    setReviewData(null);

    try {
      const response = await axios.post('/api/review', {
        code: sourceCode,
        language
      }, { timeout: 30000 }); // 30 second timeout

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
    <main>
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

      <CodeInput
        code={sourceCode}
        setCode={(newCode) => {
          setSourceCode(newCode);
          // Clear old results whenever user edits the code
          setReviewData(null);
        }}
        language={language}
        setLanguage={setLanguage}
        onSubmit={handleReviewSubmit}
        isLoading={isProcessing}
      />

      {reviewData && (
        <div id="result-section">
          <ReviewResult result={reviewData} />
        </div>
      )}
    </main>
  );
}

export default MainPage;
