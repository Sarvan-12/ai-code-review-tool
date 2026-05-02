import { useState } from 'react';
import { Sparkles, Code2, Loader2, X, RefreshCw } from 'lucide-react';


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
const SUPPORTED_LANGUAGES = ['C', 'C++', 'Go', 'Java', 'JavaScript', 'Python', 'TypeScript'];

export const LANGUAGE_SAMPLES = {
  'C': `#include <stdio.h>
int main() {
    int x = 10;
    if (x = 5) {
        printf("Equal");
    }
    return 0;
}`,
  'C++': `#include <iostream>
int main() {
    int x = 10;
    if (x = 5) {
        std::cout << "Equal";
    }
    return 0;
}`,
  'Go': `package main
import "fmt"
func main() {
    x := 10
    fmt.Println("Value is", y)
}`,
  'Java': `public class Main {
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println(nums[5]);
    }
}`,
  'JavaScript': `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
console.log(calculateSum([1, 2, 3]));`,
  'Python': `def find_max(numbers):
    max_val = 0
    for n in numbers:
        if n > max_val:
            max_val == n
    return max_val

print(find_max([-1, -2, -3]))`,
  'TypeScript': `function greet(person: string) {
  return "Hello, " + persons;
}
console.log(greet("User"));`
};

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
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(238, 242, 255, 0.6) 100%)',
      backdropFilter: 'blur(24px)',
      borderRadius: '24px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      padding: '1.5rem',
      marginBottom: '2rem',
      transition: 'all 0.3s ease',
      color: '#1e293b'
    }}>
      <form onSubmit={handleSubmit}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem', 
            paddingBottom: '0.75rem', 
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)' 
          }}>
            <label htmlFor="code-input" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#4f46e5', 
              fontWeight: '700', 
              fontSize: '0.95rem', 
              margin: 0 
            }}>
              <Code2 size={18} /> Source Code
            </label>
            <button
              type="button"
              onClick={() => setCode('')}
              disabled={isLoading || code.length === 0}
              title="Clear code"
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'transparent', border: 'none',
                color: (isLoading || code.length === 0) ? '#cbd5e1' : '#f43f5e',
                fontSize: '0.85rem', fontWeight: '600', cursor: (isLoading || code.length === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <X size={14} /> Clear
            </button>
          </div>
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
          }}>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setLocalError('');
              }}
              placeholder="Paste your code here for AI analysis..."
              maxLength={5000}
              spellCheck="false"
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#f1f5f9',
                border: 'none',
                outline: 'none',
                fontSize: '0.9rem',
                lineHeight: '1.7',
                fontFamily: "'Fira Code', 'Consolas', monospace",
                resize: 'vertical',
                minHeight: '200px',
                padding: '0'
              }}
            />
          </div>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          
          {/* Left Side: Language Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <select
                id="language-input"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                style={{
                  appearance: 'none',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  borderRadius: '100px',
                  padding: '0.5rem 2.5rem 0.5rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#4f46e5',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                const cycleLanguages = ['C', 'C++', 'Java', 'JavaScript', 'Python'];
                let nextLang = language;
                if (code === '') {
                  if (!cycleLanguages.includes(language)) nextLang = 'C';
                } else {
                  const currentIndex = cycleLanguages.indexOf(language);
                  const nextIndex = (currentIndex + 1) % cycleLanguages.length;
                  nextLang = cycleLanguages[nextIndex];
                }
                setLanguage(nextLang);
                setCode(LANGUAGE_SAMPLES[nextLang]);
                setLocalError('');
              }}
              disabled={isLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5',
                border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '100px',
                padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={16} /> Sample
            </button>
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: (isLoading || !code.trim()) ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none', borderRadius: '100px',
                padding: '0.6rem 1.75rem', fontSize: '0.95rem', fontWeight: '700',
                cursor: (isLoading || !code.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: (isLoading || !code.trim()) ? 'none' : '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && code.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(79, 70, 229, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && code.trim()) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(79, 70, 229, 0.4)';
                }
              }}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...</>
              ) : (
                <><Sparkles size={18} /> Review Code</>
              )}
              <style>
                {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
              </style>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CodeInput;
