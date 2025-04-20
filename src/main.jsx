import React from 'react';
import ReactDOM from 'react-dom/client';
// import { RouterProvider } 把React Router 的功能引入進來
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // { RouterProvider } 讓整個 App 都具備「前端換頁」的能力
  < React.StrictMode >
  <RouterProvider router={router} />
  </React.StrictMode >
);
