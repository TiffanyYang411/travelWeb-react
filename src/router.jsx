// src/router.jsx

import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import TripDetail from "./components/TripDetail";

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'explore', element: <ExploreStyle /> },
        { path: 'my-trip', element: <MyTrip /> },
        { path: 'about', element: <About /> },
        { path: 'faq', element: <FAQ /> },
        { path: 'trip/:styleId/:tripId', element: <TripDetail /> },
        { path: 'past-trips', element: <MyTrip /> }, // 可依照你需要配置
        { path: 'upcoming-trips', element: <MyTrip /> }, // 同上
        { path: '*', element: <Home /> }, // ✅ 加這行
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
  ],
  {
    // ✅ 這裡才是放 basename 的正確位置
    basename: '/travelWeb-react',
  }
);

export default router;

