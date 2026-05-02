import { useState } from 'react';
import { Check, Copy, Code, Terminal, Cpu, Clock, Globe } from 'lucide-react';
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

  const cleanCode = (code) => {
    if (!code) return '';
    let cleaned = code;
    const backtickRegex = /```(?:[a-z]*)\n?([\s\S]*?)```/i;
    const match = code.match(backtickRegex);
    if (match) {
      cleaned = match[1];
    } else {
      const codeStartRegex = /(?:^|\n)(?:\s*)(?:#include|import|from|public|private|class|function|def|const|let|var|using|package)\s+/i;
      const startIndex = cleaned.search(codeStartRegex);
      if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
      }
    }
    cleaned = cleaned.replace(/\\n/g, '\n').replace(/\\t/g, '    ').replace(/\\r/g, '');
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

  const getScoreColor = (s) => {
    if (s >= 8) return '#10b981'; // Green
    if (s >= 5) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const finalCode = cleanCode(suggestions.refactored_code);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(245, 247, 255, 0.6) 100%)',
      backdropFilter: 'blur(24px)',
      borderRadius: '24px',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
      padding: '2rem',
      marginTop: '2rem',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Score Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: '800' }}>Analysis Result</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>AI-powered code quality breakdown</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</p>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            color: getScoreColor(score),
            lineHeight: 1,
            marginTop: '4px'
          }}>
            {score * 10}<span style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: '500' }}>/100</span>
          </div>
        </div>
      </div>

      {/* Issues Sections */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <IssueList title="Critical Bugs" items={suggestions.bugs} type="bug" />
        <IssueList title="Security & Logic" items={suggestions.issues} type="issue" />
        <IssueList title="Performance" items={suggestions.performance} type="performance" />
        <IssueList title="Best Practices" items={suggestions.improvements} type="improvement" />
      </div>

      {/* Refactored Code Section */}
      {finalCode && (
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '1rem' 
          }}>
            <h3 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              margin: 0, 
              color: '#4f46e5',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              <Code size={20} /> Refactored Code
            </h3>
          </div>
          
          <div style={{ 
            position: 'relative',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <SyntaxHighlighter
              language={getLanguageAlias(language)}
              style={vscDarkPlus}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                fontSize: '0.9rem',
                backgroundColor: 'transparent',
                lineHeight: '1.7',
                fontFamily: "'Fira Code', 'Consolas', monospace",
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'inherit',
                }
              }}
            >
              {finalCode}
            </SyntaxHighlighter>
            
            <button 
              onClick={handleCopy}
              style={{ 
                position: 'absolute', 
                bottom: '12px', 
                right: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '6px 14px',
                borderRadius: '100px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Code</>}
            </button>
          </div>
        </div>
      )}

      {/* Meta Information Footer */}
      <div style={{ 
        marginTop: '2.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(99, 102, 241, 0.1)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={14} /> <strong>Language:</strong> {language}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} /> <strong>Engine:</strong> {model.split('-').slice(0, 2).join('-')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} /> <strong>Latency:</strong> {responseTime}ms
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ReviewResult;

