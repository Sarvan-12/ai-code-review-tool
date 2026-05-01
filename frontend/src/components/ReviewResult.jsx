import { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import IssueList from './IssueList';

/**
 * ReviewResult component displays the AI feedback once available.
 * 
 * @param {object} result - The response data from the backend
 */
const ReviewResult = ({ result }) => {
  const [copied, setCopied] = useState(false);
  
  if (!result || !result.data) return null;

  const { suggestions, responseTime, model, language } = result.data;
  const score = suggestions.score;

  /**
   * Maps UI language names to SyntaxHighlighter supported aliases.
   */
  const getLanguageAlias = (lang) => {
    if (!lang) return 'plaintext';
    const l = lang.toLowerCase();
    if (l === 'c++') return 'cpp';
    if (l === 'c#') return 'csharp';
    return l;
  };

  /**
   * Extract only the code content from the AI response.
   * Prioritizes content within markdown triple backticks.
   */
  const cleanCode = (code) => {
    if (!code) return '';
    
    let cleaned = code;

    // 1. Try to extract from triple backticks first (standard markdown)
    const backtickRegex = /```(?:[a-z]*)\n?([\s\S]*?)```/i;
    const match = code.match(backtickRegex);
    
    if (match) {
      cleaned = match[1];
    } else {
      // 2. Fallback: If no backticks, try to strip conversational intro
      // Looks for text like "Here is the code:" or "Corrected code:" followed by common code starts
      // This regex looks for common starting patterns (imports, includes, etc.) 
      // and takes everything from that point onwards.
      const codeStartRegex = /(?:^|\n)(?:\s*)(?:#include|import|from|public|private|class|function|def|const|let|var|using|package)\s+/i;
      const startIndex = cleaned.search(codeStartRegex);
      
      if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
      }
    }
    
    // Final cleanup of literal escape sequences and whitespace
    cleaned = cleaned
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '    ')
      .replace(/\\r/g, '');

    return cleaned.trim();
  };

  const handleCopy = () => {
    const codeToCopy = cleanCode(suggestions.refactored_code);
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Determine score badge color
  const getScoreClass = (s) => {
    if (s >= 8) return 'score-high';
    if (s >= 5) return 'score-mid';
    return 'score-low';
  };

  const finalCode = cleanCode(suggestions.refactored_code);

  return (
    <div className="card">
      {/* Score Header */}
      <div className="score-container">
        <p className="score-label">Code Quality Score</p>
        <div className={`score-badge ${getScoreClass(score)}`}>
          {score * 10}/100
        </div>
      </div>

      {/* Issues Sections */}
      <IssueList title="Critical Bugs" items={suggestions.bugs} type="bug" />
      <IssueList title="Security & Logic Issues" items={suggestions.issues} type="issue" />
      <IssueList title="Performance Optimizations" items={suggestions.performance} type="performance" />
      <IssueList title="Improvements & Best Practices" items={suggestions.improvements} type="improvement" />

      {/* Refactored Code Section */}
      {finalCode && (
        <div className="refactor-section">
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={20} className="text-slate-700" /> Refactored Code
          </h3>
          <div className="refactored-code-container">
            <button 
              className="copy-btn" 
              onClick={handleCopy}
              title="Copy to clipboard"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
            </button>
            <div className="syntax-highlighter-wrapper">
              <SyntaxHighlighter
                language={getLanguageAlias(language)}
                style={vscDarkPlus}
                wrapLongLines={true}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.9rem',
                  backgroundColor: '#020617',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
                codeTagProps={{
                   style: {
                     fontFamily: "'Fira Code', monospace",
                     whiteSpace: 'pre-wrap',
                     wordBreak: 'break-word'
                   }
                }}
              >
                {finalCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}

      {/* Meta Information Footer */}
      <div className="meta-info">
        <span><strong>Language:</strong> {language}</span>
        <span><strong>Model:</strong> {model}</span>
        <span><strong>Response Time:</strong> {responseTime}ms</span>
      </div>
    </div>
  );
};

export default ReviewResult;
