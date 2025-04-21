// src/router.jsx
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ExploreStyle from './pages/ExploreStyle';
import MyTrip from './pages/MyTrip';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Login from './pages/Login';

const router = createBrowserRouter([
    {
        path: '/',
        // Layout 是最外層框架
        element: <Layout />,
        children: [
            { index: true, element: <Home /> }, // 路徑是 "/"
            { path: 'explore', element: <ExploreStyle /> },
            { path: 'my-trip', element: <MyTrip /> },
            { path: 'about', element: <About /> },
            { path: 'faq', element: <FAQ /> },
        ]
    },
    {
        // 沒有 Navbar / Footer（因為不在共用 Layout 裡）
        path: '/login',
        element: <Login /> // 不使用共用 Layout（例如登入頁可跳過 Navbar）
    }
],
{
    basename: '/travelWeb-react'
}
);

export default router;