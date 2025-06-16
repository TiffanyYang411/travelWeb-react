// src/hooks/usePageTitle.js
import { useEffect } from 'react';

function usePageTitle(title) {
  useEffect(() => {
    document.title = `ÉLAN JOURNEYS 北歐高端旅遊規劃平台｜${title}`; // 使用全形 U+FF5C
  }, [title]);
}

export default usePageTitle;

