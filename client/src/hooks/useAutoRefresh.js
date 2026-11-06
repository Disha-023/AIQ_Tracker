import { useEffect, useRef } from 'react';

/**
 * Reusable auto-refresh hook for polling API endpoints safely.
 *
 * @param {Function} callback - The function to call on each interval (typically an API fetch).
 * @param {number} intervalMs - Polling interval in milliseconds (defaults to 8000).
 * @param {boolean} enabled - Whether polling is active (defaults to true).
 */
export function useAutoRefresh(callback, intervalMs = 8000, enabled = true) {
  const savedCallback = useRef(callback);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // Execute immediately on mount/enable
    const runCallback = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        await savedCallback.current();
      } catch (err) {
        console.error('Auto-refresh hook error:', err);
      } finally {
        isFetchingRef.current = false;
      }
    };

    runCallback();

    const id = setInterval(runCallback, intervalMs);

    return () => {
      clearInterval(id);
    };
  }, [intervalMs, enabled]);
}

export default useAutoRefresh;
