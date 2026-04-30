import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

import type { Goal } from '@/features/goals/domain/types';
import { goalsRepository } from '@/shared/db';

export function useGoal(goalId: string) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!goalId) {
      setGoal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const nextGoal = await goalsRepository.getGoal(goalId);
      setGoal(nextGoal);
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не удалось загрузить цель.');
    } finally {
      setIsLoading(false);
    }
  }, [goalId]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return { error, goal, isLoading, refresh };
}
