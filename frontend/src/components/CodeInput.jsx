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
            placeholder="Paste your code here (max 5000 characters)..."
            maxLength={5000}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="language-input">Language</label>
          <input
            id="language-input"
            className="lang-input"
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g. python, javascript"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isLoading || !code.trim()}
        >
          {isLoading ? 'Analyzing Code...' : 'Review Code'}
        </button>
      </form>
    </div>
  );
};

export default CodeInput;
