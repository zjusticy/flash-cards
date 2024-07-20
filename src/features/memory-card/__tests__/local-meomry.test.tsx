import { renderHook, act } from '@testing-library/react-hooks';
import useLocalCards from '../use-local-memory-card'; // Adjust the import according to your file structure
// import localforage from 'localforage';
// import { CardsDataType } from '@/types';
import { CardType } from '../types-memory-card';
import { beforeEach, describe, test, expect, vi } from 'vitest';

import localforage from 'localforage';

// Mocking localforage

vi.mock('localforage');

describe('useLocalCards', () => {
  const mockActiveListName = 'testList';
  const mockCard: CardType = {
    id: '1',
    title: 'Test Card',
    frontValue: 'This is the front side',
    backValue: 'This is the back side',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should initialize with empty state', async () => {
    vi.mocked(localforage.getItem).mockResolvedValue(null);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    expect(result.current.cardsDataLocal).toEqual({
      cardsCache: {},
      sortedIds: [],
      activeId: null,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  test('should load existing cards', async () => {
    const mockExistingCards = { '1': mockCard };
    vi.mocked(localforage.getItem).mockResolvedValue(mockExistingCards);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    expect(result.current.cardsDataLocal).toEqual({
      cardsCache: mockExistingCards,
      sortedIds: ['1'],
      activeId: null,
    });
  });

  test('should add a new card', async () => {
    vi.mocked(localforage.getItem).mockResolvedValue({});
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    act(() => {
      result.current.onAddCard(mockCard, mockActiveListName);
    });

    expect(result.current.cardsDataLocal.cardsCache).toEqual({ '1': mockCard });
    expect(result.current.cardsDataLocal.sortedIds).toEqual(['1']);
    expect(localforage.setItem).toHaveBeenCalledWith(mockActiveListName, {
      '1': mockCard,
    });
  });

  test('should delete a card', async () => {
    const mockExistingCards = {
      '1': mockCard,
      '2': {
        id: '2',
        title: 'Another Card',
        frontValue: 'This is the front side',
        backValue: 'This is the back side',
      },
    };
    vi.mocked(localforage.getItem).mockResolvedValue(mockExistingCards);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    act(() => {
      result.current.onDeleteCard(mockActiveListName, '1');
    });

    // await waitForNextUpdate();

    expect(result.current.cardsDataLocal.cardsCache).toEqual({
      '2': {
        id: '2',
        title: 'Another Card',
        frontValue: 'This is the front side',
        backValue: 'This is the back side',
      },
    });
    expect(result.current.cardsDataLocal.sortedIds).toEqual(['2']);
    expect(localforage.setItem).toHaveBeenCalledWith(mockActiveListName, {
      '2': {
        id: '2',
        title: 'Another Card',
        frontValue: 'This is the front side',
        backValue: 'This is the back side',
      },
    });
  });

  test('should update a card', async () => {
    const mockExistingCards = { '1': mockCard };
    vi.mocked(localforage.getItem).mockResolvedValue(mockExistingCards);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    const updatedCard = { ...mockCard, title: 'Updated Content' };

    act(() => {
      result.current.onUpdateCard(mockActiveListName, updatedCard);
    });

    expect(result.current.cardsDataLocal.cardsCache).toEqual({
      '1': updatedCard,
    });
    expect(localforage.setItem).toHaveBeenCalledWith(mockActiveListName, {
      '1': updatedCard,
    });
  });

  test('should handle errors', async () => {
    vi.mocked(localforage.getItem).mockRejectedValue(new Error('Test error'));

    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalCards(mockActiveListName)
    );

    await waitForNextUpdate();

    expect(result.current.error).toBe('err');
    expect(result.current.isLoading).toBe(false);
  });
});
