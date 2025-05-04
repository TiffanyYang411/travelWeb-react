// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css'; // 全域樣式入口（可包含 reset、字型等）

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* 全站使用 router 管理頁面切換 */}
  </React.StrictMode>
);

