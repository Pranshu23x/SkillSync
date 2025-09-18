import { useState, useEffect } from 'react';
import { Internship } from '../types/Internship';

export const useInternships = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await fetch('/thing.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setInternships(data);
        setError(null);
      } catch (err) {
        console.error('Error loading internships:', err);
        setError('Failed to load internships data');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return { internships, loading, error };
};