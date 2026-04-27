import { useState } from 'react';
import axios from 'axios';
import CodeInput from '../components/CodeInput';
import ReviewResult from '../components/ReviewResult';

function MainPage() {
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('python');
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
      });

      setReviewData(response.data);

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 200);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred';
      setErrorMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main>
      {errorMessage && (
        <div className="error-box">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <CodeInput
        code={sourceCode}
        setCode={setSourceCode}
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
