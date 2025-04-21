import type { BaseKey } from '@refinedev/core';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for managing active screen configuration
 * @returns {Object} Object containing active config ID and function to change it
 */
export const useActiveConfig = () => {
  const [activeConfigId, setActiveConfigId] = useState<BaseKey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch active configuration from API
  const fetchActiveConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/screen');
      if (response.data?.id) {
        setActiveConfigId(response.data.id);
      } else {
        setActiveConfigId(null);
      }
    } catch (err) {
      console.error('Error fetching active screen configuration:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setActiveConfigId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Change active configuration
  const changeActiveConfig = useCallback(async (configId: BaseKey) => {
    if (!configId) return false;
      setActiveConfigId(configId);
  }, []);

  // Fetch active configuration on mount
  useEffect(() => {
    fetchActiveConfig();
  }, [fetchActiveConfig]);

  return {
    activeConfigId,
    changeActiveConfig,
    error,
    loading,
    refetch: fetchActiveConfig,
  };
};