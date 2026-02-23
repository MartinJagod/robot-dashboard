import { useState, useEffect } from 'react';
import { API_BASE } from '../utils/apiBase';

/**
 * Hook para obtener los días trabajados de un robot
 * @param {string} robotName - Nombre del robot (ej: "Beetle003")
 * @returns {Object} { workdays: string[], loading: boolean, error: string|null }
 */
export default function useWorkdays(robotName) {
  const [workdays, setWorkdays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!robotName) {
      setWorkdays([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE}/robot_workdays?name=${robotName}`;
        console.log('📅 Fetching workdays:', url);
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudieron obtener los días trabajados');
        
        const data = await res.json();
        
        if (!cancelled) {
          // Convertir a formato YYYY-MM-DD para comparar con el input date
          const formatted = (data || []).map(dateStr => 
            dateStr.split('T')[0]
          );
          setWorkdays(formatted);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching workdays:', err);
          setError(err.message);
          setWorkdays([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [robotName]);

  return { workdays, loading, error };
}