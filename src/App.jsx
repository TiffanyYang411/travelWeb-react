// src/App.jsx（乾淨版：只當 entry point，用於 RouterProvider）
import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

