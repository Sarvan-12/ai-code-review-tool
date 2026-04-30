import { NavLink } from 'react-router-dom';


/**
 * Header component for the AI Code Reviewer
 * Displays the main title and sub-tagline
 */
const Header = () => {
  return (
    <header>
      <h1>AI Code Reviewer</h1>
      <p>Upload your code and get instant, actionable feedback from AI.</p>
      <nav className="main-nav">
        <NavLink to="/" className="nav-link" end>Home</NavLink>
        <NavLink to="/history" className="nav-link">History</NavLink>
      </nav>
    </header>
  );
};

export default Header;
