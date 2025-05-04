// src/router.jsx
// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import TripDetail from "./components/TripDetail";  // ✅ 新增的 TripDetail 頁

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />, // ✅ 包含 ScrollToTop / Navbar / Footer
      children: [
        { index: true, element: <Home /> },
        { path: 'explore', element: <ExploreStyle /> },
        { path: 'my-trip', element: <MyTrip /> },
        { path: 'about', element: <About /> },
        { path: 'faq', element: <FAQ /> },
        { path: 'trip/:styleId/:tripId', element: <TripDetail /> }, // ✅ 新增這一行
      ],
    },
    {
      path: '/login',
      element: <Login />, // ❗ 不含 Layout（例如不需 Navbar）
    },
  ],
  {
    basename: '/travelWeb-react',
  }
);

export default router;
