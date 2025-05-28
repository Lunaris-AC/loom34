import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook qui limite le nombre d'appels à une fonction dans un intervalle de temps donné.
 * @param callback Fonction à limiter
 * @param delay Délai en millisecondes entre les appels autorisés
 * @returns Version limitée de la fonction
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastCall = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Nettoyage du timeout si le composant est démonté
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;

      // Si c'est le premier appel ou si on a dépassé le délai
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      } else {
        // Sinon, on programme un appel différé
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastCall.current = Date.now();
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
          }
        }, delay - (now - lastCall.current));
      }
    },
    [callback, delay]
  );
}
