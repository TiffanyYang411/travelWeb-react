import { useEffect } from 'react';

export function useHorizontalDragScroll(ref) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    // ✨ Touch 支援
    let touchStartX = 0;
    let touchScrollLeft = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].pageX - container.offsetLeft;
      touchScrollLeft = container.scrollLeft;
    };

    const handleTouchMove = (e) => {
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - touchStartX) * 1.5;
      container.scrollLeft = touchScrollLeft - walk;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ref]);
}
