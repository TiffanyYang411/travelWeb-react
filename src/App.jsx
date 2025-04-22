import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ⬅️ 你目前少了這行
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import './App.css';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<ExploreStyle />} />
        <Route path="/mytrip" element={<MyTrip />} />
      </Routes>

      <Footer /> {/* ✅ 加在這邊！這樣所有頁面自動有 Footer，不用每頁重寫 */}
    </>
  );
}

export default App;
