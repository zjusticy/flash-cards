import useSWR from 'swr';
import { getCards } from './api-memory-card';

export default function useCards(activeListName: string) {
  const {
    data: cards,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/cards/${activeListName}`, async () => {
    const snapshot = await getCards(activeListName);
    if (snapshot && snapshot.val()) {
      return snapshot.val();
    }

    return {};
  });

  return {
    cards,
    mutate,
    error,
    isLoading,
  };
}
