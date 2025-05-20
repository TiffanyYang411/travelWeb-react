// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css'; // 全域樣式
import { TripProvider } from './store/TripStore'; // ⭐ 新增這行！
console.log('🧪 這是正在執行的 main.jsx');
ReactDOM.createRoot(document.getElementById('root')).render(

  <TripProvider>
    <RouterProvider router={router} />
  </TripProvider>

);


