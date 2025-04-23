import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About'; // ← 確保這些有引入
import Faq from './pages/Faq';
import ScrollToTop from './components/ScrollToTop'; // ← 新增這一行
import './App.css';

function App() {
  return (
    <div className="app-container">
      <ScrollToTop /> {/* ← 加在最上層 */}
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreStyle />} />
          <Route path="/mytrip" element={<MyTrip />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
