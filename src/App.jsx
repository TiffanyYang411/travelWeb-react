import { Routes, Route } from 'react-router-dom'
// import { Routes, Route } from 'react-router-dom' => 引入 React Router 元件，用來設定「前端的換頁規則」
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <>
      {/* Navbar => 導覽列會出現在所有頁面上 */}
      <Navbar />

      {/* <Routes> => 路由容器，包住所有 <Route> */}
      <Routes>
        {/* <Route path="/" element={<Home />} />	當網址是 /，顯示 Home 元件 */}
        {/* element={<... />}	要渲染出來的頁面元件 */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/explore" element={<ExploreStyle />} />	當網址是 /explore，顯示探索頁 */}
        <Route path="/explore" element={<ExploreStyle />} />
        <Route path="/mytrip" element={<MyTrip />} />
      </Routes>
    </>
  )
}

export default App
