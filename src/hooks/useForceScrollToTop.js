import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useForceScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    const shouldScroll = sessionStorage.getItem('forceScrollToTop') === 'true';
    if (shouldScroll) {
      window.scrollTo(0, 0); // 立即 scroll，避免 overlay 卡住
      sessionStorage.removeItem('forceScrollToTop');
    }
  }, [location.pathname, location.search]);
}

export default useForceScrollToTop;
