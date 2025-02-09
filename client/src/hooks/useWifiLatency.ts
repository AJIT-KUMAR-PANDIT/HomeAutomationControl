
import { useEffect } from 'react';

export function useWifiLatency() {
  useEffect(() => {
    const checkLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/ping');
        const latency = Math.round(performance.now() - start);
        const element = document.getElementById('latency');
        if (element) {
          element.textContent = `${latency} ms`;
        }
      } catch (error) {
        console.error('Failed to check latency:', error);
      }
    };

    const interval = setInterval(checkLatency, 1000);
    return () => clearInterval(interval);
  }, []);
}
