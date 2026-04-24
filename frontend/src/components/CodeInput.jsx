import React from 'react';

/**
 * CodeInput component handles the input form for code and language.
 * 
 * @param {string} code - The current code string
 * @param {function} setCode - Function to update code
 * @param {string} language - The current language
 * @param {function} setLanguage - Function to update language
 * @param {function} onSubmit - Submit handler
 * @param {boolean} isLoading - Loading state for the submit button
 */
const SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'plaintext'];

const CodeInput = ({ code, setCode, language, setLanguage, onSubmit, isLoading }) => {
  return (
    <div className="card">
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label htmlFor="code-input">Source Code</label>
          <textarea
            id="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here (min 5, max 5000 characters)..."
            maxLength={5000}
            required
          />
          {code.trim() && code.trim().length < 5 && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Code must be at least 5 characters long.
            </p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="language-input">Language</label>
          <select
            id="language-input"
            className="lang-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || code.trim().length < 5}
        >
          {isLoading ? 'Analyzing Code...' : 'Review Code'}
        </button>
      </form>
    </div>
  );
};

export default CodeInput;
