import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About'; // ✅ 已引入
import Faq from './pages/FAQ';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreStyle />} />
          <Route path="/mytrip" element={<MyTrip />} />
          <Route path="/about" element={<About />} /> {/* ✅ 新增這行 */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

