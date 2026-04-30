import { useState, useEffect } from 'react';

/**
 * CodeInput component handles the input form for code and language.
 */
const SUPPORTED_LANGUAGES = [
  'Bash', 'C', 'C#', 'C++', 'CSS', 'Dart', 'Docker', 'Go', 'HTML', 'Java', 
  'JavaScript', 'JSON', 'Kotlin', 'Markdown', 'PHP', 'Python', 'R', 
  'Ruby', 'Rust', 'SQL', 'Swift', 'TypeScript', 'XML', 'YAML'
].sort();

export const LANGUAGE_SAMPLES = {
  'C': `#include <stdio.h>\nint main() {\n    int x = 10;\n    if (x = 5) {\n        printf("Equal");\n    }\n    return 0;\n}`,
  'C++': `#include <iostream>\nint main() {\n    int x = 10;\n    if (x = 5) {\n        std::cout << "Equal";\n    }\n    return 0;\n}`,
  'JavaScript': `function calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}\nconsole.log(calculateSum([1, 2, 3]));`,
  'Python': `def find_max(numbers):\n    max_val = 0\n    for n in numbers:\n        if n > max_val:\n            max_val == n\n    return max_val\n\nprint(find_max([-1, -2, -3]))`,
  'Java': `public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3};\n        System.out.println(nums[5]);\n    }\n}`,
  'TypeScript': `function greet(person: string) {\n  return "Hello, " + persons;\n}\nconsole.log(greet("User"));`,
  'Go': `package main\nimport "fmt"\nfunc main() {\n    x := 10\n    fmt.Println("Value is", y)\n}`
};

const CodeInput = ({ code, setCode, language, setLanguage, onSubmit, isLoading }) => {
  const [localError, setLocalError] = useState('');

  // Auto-set sample code when language changes and field is empty
  useEffect(() => {
    if (!code && LANGUAGE_SAMPLES[language]) {
      setCode(LANGUAGE_SAMPLES[language]);
    }
  }, [language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setLocalError("Please paste some code before submitting");
      return;
    }
    setLocalError('');
    onSubmit(e);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <div className="input-group-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="language-select">Select Language</label>
            {localError && <span className="local-error-text">{localError}</span>}
          </div>
          <select 
            id="language-select"
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#020617',
              color: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <div className="input-group-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label htmlFor="code-input">Source Code</label>
            <button
              type="button"
              className="btn-clear-corner"
              onClick={() => setCode('')}
              disabled={isLoading || !code}
            >
              ✕ Clear
            </button>
          </div>
          <textarea
            id="code-input"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (localError) setLocalError('');
            }}
            placeholder="Paste your code here..."
            disabled={isLoading}
          />
          <div className="char-counter">
            {code.length} characters
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <><span className="spinner"></span> Analyzing Code...</>
          ) : (
            '🚀 Get AI Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default CodeInput;
