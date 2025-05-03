// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' }); // 可改成 'smooth' 即時跳轉
  }, [pathname]);

  return null;
}

export default ScrollToTop;
