import { useEffect } from 'react';

export function usePreventDragAndContextMenuToast() {
  useEffect(() => {
    const contextHandler = () => {};

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        alert('복사 방지를 위해 Ctrl+C는 불가능 합니다.');
      }
    };

    window.addEventListener('contextmenu', contextHandler);
    window.addEventListener('keydown', keydownHandler);

    return () => {
      window.removeEventListener('contextmenu', contextHandler);
      window.removeEventListener('keydown', keydownHandler);
    };
  }, []);
}
