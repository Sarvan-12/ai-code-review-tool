import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import HistoryPage from './pages/HistoryPage';
import { BgradientAnim } from './components/ui/soft-gradient-background-animation';
import './App.css';

/**
 * Root component — sets up routing only.
 * All page-level logic lives inside the individual page components.
 */
function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fixed soft gradient background — sits behind all content */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}>
        <BgradientAnim animationDuration={8} />
      </div>

      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;

