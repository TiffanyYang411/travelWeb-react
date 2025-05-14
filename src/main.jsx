// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css'; // 全域樣式
import { TripProvider } from './store/TripStore'; // ⭐ 新增這行！

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TripProvider> {/* ⭐ 用TripProvider包住整個網站 */}
      <RouterProvider router={router} />
    </TripProvider>
  </React.StrictMode>
);


