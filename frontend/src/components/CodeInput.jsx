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
const SUPPORTED_LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go'];

const LANGUAGE_SAMPLES = {
  python: `def find_max(numbers):
    max_val = 0
    for n in numbers:
        if n > max_val:
            max_val == n
    return max_val

print(find_max([-1, -2, -3]))`,
  javascript: `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
console.log(calculateSum([1, 2, 3]));`,
  typescript: `function greet(person: string) {
  return "Hello, " + persons;
}
console.log(greet("User"));`,
  java: `public class Main {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println(nums[5]);
    }
}`,
  cpp: `#include <iostream>
int main() {
    int x = 10;
    if (x = 5) {
        std::cout << "Equal";
    }
    return 0;
}`,
  go: `package main
import "fmt"
func main() {
    x := 10
    fmt.Println("Value is", y)
}`
};

const CodeInput = ({ code, setCode, language, setLanguage, onSubmit, isLoading }) => {
  return (
    <div className="card">
      <form onSubmit={onSubmit}>
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
            disabled={isLoading || code.trim().length < 5}
          >
            {isLoading ? 'Analyzing Code...' : 'Review Code'}
          </button>
          <button
            type="button"
            className="btn btn-sample"
            onClick={() => {
              const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
              const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
              const nextLang = SUPPORTED_LANGUAGES[nextIndex];
              
              setLanguage(nextLang);
              setCode(LANGUAGE_SAMPLES[nextLang]);
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
