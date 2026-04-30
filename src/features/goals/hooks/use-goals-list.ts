import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import type { Goal } from '@/features/goals/domain/types';
import { goalsRepository } from '@/shared/db';

export function useGoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const nextGoals = await goalsRepository.listGoals({ status: 'active' });
      setGoals(nextGoals);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не удалось загрузить цели.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { error, goals, isLoading, refresh };
}
