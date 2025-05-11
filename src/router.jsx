// src/import { createBrowserRouter, Navigate } from 'react-router-dom';
import { createBrowserRouter, Navigate } from 'react-router-dom'; // ✅ 要加這行！
import Layout from './components/Layout';
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import TripDetail from "./components/TripDetail";
import TripCustomization from './pages/TripCustomization';


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
        { path: 'past-trips', element: <MyTrip /> },
        { path: 'upcoming-trips', element: <MyTrip /> },
        { path: 'trip-customization', element: <TripCustomization /> }, // ✅ 正式加這一條
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '*',
      element: <Navigate to="/explore" replace />,
    },
  ],
  {
    basename: '/travelWeb-react',
  }
);

export default router;
