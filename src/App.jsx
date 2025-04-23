import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import './App.css';

function App() {
  return (
    <div className="app-container">
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
