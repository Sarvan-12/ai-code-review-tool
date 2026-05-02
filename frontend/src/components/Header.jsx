import { NavLink, useLocation } from 'react-router-dom';

/**
 * Header component — Premium Hero + Animated Pill Tabs
 * Inspired by 21st.dev Tailark Hero & Reui Tabs Pill components.
 */
const Header = () => {
  const location = useLocation();

  return (
    <header style={{
      textAlign: 'center',
      padding: '1.5rem 1rem 1rem',
      position: 'relative',
    }}>

      {/* Animated Title */}
      <h1 
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '900',
          lineHeight: 1.1,
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #020617, #334155, #020617)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
          animation: 'shine 5s linear infinite',
        }}
      >
        AI Code Reviewer
        <style>
          {`
            @keyframes shine {
              to {
                background-position: 200% center;
              }
            }
          `}
        </style>
      </h1>

      {/* Subtitle */}
      <p style={{
        color: '#334155',
        fontSize: '1.1rem',
        maxWidth: '500px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6,
        fontWeight: '500',
      }}>
        Upload your code and get instant, actionable feedback from AI.
      </p>

      {/* Animated Pill Tabs */}
      <nav style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '100px',
        padding: '5px',
        gap: '4px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      }}>
        {[
          { to: '/', label: 'Home', end: true },
          { to: '/history', label: 'History', end: false },
        ].map(({ to, label, end }) => {
          const isActive = end
            ? location.pathname === '/'
            : location.pathname.startsWith('/history');

          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={{
                display: 'inline-block',
                padding: '0.6rem 1.8rem',
                borderRadius: '100px',
                fontSize: '0.95rem',
                fontWeight: '700',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isActive ? '#020617' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                boxShadow: isActive ? '0 4px 12px rgba(2, 6, 23, 0.3)' : 'none',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.color = '#020617';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.color = '#475569';
              }}
            >
              {label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};

export default Header;

