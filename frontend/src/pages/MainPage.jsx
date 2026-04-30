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
      let errorMsg = '';
      let type = 'generic';

      if (err.code === 'ECONNABORTED' || (err.message && err.message.toLowerCase().includes('timeout'))) {
        errorMsg = 'The AI is taking too long to respond. Please try again.';
        type = 'timeout';
      } else if (err.response) {
        // If our backend sent a structured JSON error, use it (even if it's 502 or 504)
        if (err.response.data && err.response.data.error) {
          errorMsg = err.response.data.error;
          type = err.response.data.type || 'server';
        } 
        // Otherwise, if it's 502 or 504 without our JSON, it's a Vite proxy error (backend is down)
        else if (err.response.status === 504 || err.response.status === 502) {
          errorMsg = 'Network error. Please check your internet connection.';
          type = 'network';
        } else {
          errorMsg = 'Something went wrong on the server. Please try again later.';
          type = 'server';
        }
      } else {
        // Fallback for no response (network errors, server unreachable)
        errorMsg = 'Network error. Please check your internet connection.';
        type = 'network';
      }

      setErrorMessage(errorMsg);
      setErrorType(type);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container-centered">
      <h2 className="section-title">New Code Review</h2>
      {errorMessage && (
        <div className={`error-box error-${errorType || 'generic'}`}>
          <div className="error-content">
            <strong>
              {errorType === 'timeout' ? 'Timeout:' : 
               errorType === 'network' ? 'Network Error:' : 
               errorType === 'server' ? 'Server Error:' : 'Error:'}
            </strong> {errorMessage}
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
