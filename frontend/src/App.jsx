import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

/**
 * Root component — sets up routing only.
 * All page-level logic lives inside the individual page components.
 */
function App() {
  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
