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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    setIsProcessing(true);
    setErrorMessage('');
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
      // Show user-friendly messages based on HTTP status code
      let errorMsg;

      if (err.code === 'ECONNABORTED') {
        errorMsg = 'The AI is taking too long to respond. Please try again.';
      } else {
        const status = err.response?.status;
        if (status === 400) {
          errorMsg = 'Invalid input — check your code and try again';
        } else if (status === 429) {
          errorMsg = 'Too many requests — please wait a moment before trying again';
        } else if (status === 500) {
          errorMsg = 'Something went wrong on the server — try again in a few seconds';
        } else {
          errorMsg = 'Failed to connect to the server. Check your network.';
        }
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main>
      {errorMessage && (
        <div className="error-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Error:</strong> {errorMessage}</span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
            onClick={handleReviewSubmit}
          >
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
