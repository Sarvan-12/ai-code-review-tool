import React, { useState } from 'react';

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

const SAMPLE_CODE = `# Python — contains intentional bugs for review demo
def calculate_average(numbers):
    total = 0
    for i in range(len(numbers)):
        total =+ numbers[i]   # bug: =+ should be +=
    average = total / len(numbers)  # bug: ZeroDivisionError if list is empty
    return average

def find_duplicates(lst):
    seen = []
    duplicates = []
    for item in lst:
        if item in seen:
            duplicates.append(item)
        seen.append(item)  # bug: should append only if not already seen
    return list(set(duplicates))

def fetch_user(user_id):
    users = {1: 'Alice', 2: 'Bob', 3: 'Charlie'}
    return users[user_id]   # bug: KeyError if user_id not in dict; no default

result = calculate_average([])
print('Average:', result)

dupes = find_duplicates([1, 2, 2, 3, 3, 3, 4])
print('Duplicates:', dupes)

user = fetch_user(99)
print('User:', user)
`;

const CodeInput = ({ code, setCode, language, setLanguage, onSubmit, isLoading }) => {
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setLocalError("Please paste some code before submitting");
      return;
    }
    if (code.length < 5) {
      setLocalError("Code is too short to review");
      return;
    }
    onSubmit(e);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-group-header">
            <label htmlFor="code-input">Source Code</label>
            <button
              type="button"
              className="btn-clear-corner"
              onClick={() => setCode('')}
              disabled={isLoading || code.length === 0}
              title="Clear code"
            >
              ✕ Clear
            </button>
          </div>
          <textarea
            id="code-input"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setLocalError('');
            }}
            placeholder="Paste your code here (min 5, max 5000 characters)..."
            maxLength={5000}
            required
          />
          {localError && (
            <p className="local-error-text">
              {localError}
            </p>
          )}
          {code.trim() && code.trim().length < 5 && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Code must be at least 5 characters long.
            </p>
          )}
          <p
            className="char-counter"
            style={{
              color:
                code.length > 4900
                  ? 'var(--danger)'
                  : code.length > 4000
                    ? 'var(--warning)'
                    : 'var(--text-muted)',
            }}
          >
            {code.length} / 5000
          </p>
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

        <div className="btn-row">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing Code...' : 'Review Code'}
          </button>
          <button
            type="button"
            className="btn btn-sample"
            onClick={() => {
              setCode(SAMPLE_CODE);
              setLanguage('python');
            }}
            disabled={isLoading}
            title="Load a buggy sample for testing"
          >
            ⚡ Sample Code
          </button>
        </div>
      </form>
    </div>
  );
};

export default CodeInput;
