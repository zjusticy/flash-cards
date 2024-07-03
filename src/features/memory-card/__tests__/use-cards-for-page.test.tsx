import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import useCardsForPage from '../use-memory-card';
import { addCard, removeCard, updateCard } from '../api-memory-card';

// Mock the API functions
vi.mock('../api-memory-card', () => ({
  addCard: vi.fn(),
  removeCard: vi.fn(),
  updateCard: vi.fn(),
}));

describe('useCardsForPage', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCardsForPage());
    expect(result.current.cardsData).toEqual({
      cardsCache: null,
      sortedIds: [],
      activeId: null,
    });
  });

  it('should handle onInitExist correctly', () => {
    const { result } = renderHook(() => useCardsForPage());
    act(() => {
      result.current.onInitExist(['id1', 'id2'], 'id1');
    });
    expect(result.current.cardsData.sortedIds).toEqual(['id1', 'id2']);
    expect(result.current.cardsData.activeId).toBe('id1');
  });

  it('should handle onAddCard correctly', () => {
    const { result } = renderHook(() => useCardsForPage());
    const newCard = {
      id: 'newId',
      title: 'New Card',
      frontValue: 'This is the front side',
      backValue: 'This is the back side',
    };
    act(() => {
      result.current.setCardsData((draft) => {
        draft.cardsCache = {};
      });
      result.current.onAddCard(newCard, 'testList');
    });
    expect(result.current.cardsData.sortedIds).toEqual(['newId']);
    expect(result.current.cardsData.cardsCache?.newId).toEqual(newCard);
    expect(addCard).toHaveBeenCalledWith(newCard, 'testList');
  });

  it('should handle onDeleteCard correctly', () => {
    const { result } = renderHook(() => useCardsForPage());
    act(() => {
      result.current.setCardsData((draft) => {
        draft.cardsCache = {
          id1: {
            id: 'id1',
            title: 'Card 1',
            frontValue: 'This is the front side',
            backValue: 'This is the back side',
          },
        };
        draft.sortedIds = ['id1'];
      });
    });
    act(() => {
      result.current.onDeleteCard('testList', 'id1');
    });
    expect(result.current.cardsData.sortedIds).toEqual([]);
    expect(result.current.cardsData.cardsCache?.id1).toBeUndefined();
    expect(removeCard).toHaveBeenCalledWith('testList', 'id1');
  });

  it('should handle onUpdateCard correctly', () => {
    const { result } = renderHook(() => useCardsForPage());
    const updatedCard = {
      id: 'id1',
      title: 'Updated Card',
      frontValue: 'This is the front side',
      backValue: 'This is the back side',
    };
    act(() => {
      result.current.setCardsData((draft) => {
        draft.cardsCache = {
          id1: {
            id: 'id1',
            title: 'Card 1',
            frontValue: 'This is the front side',
            backValue: 'This is the back side',
          },
        };
      });
    });
    act(() => {
      result.current.onUpdateCard('testList', updatedCard);
    });
    expect(result.current.cardsData.cardsCache?.id1).toEqual(updatedCard);
    expect(updateCard).toHaveBeenCalledWith(updatedCard, 'testList');
  });

  it('should handle onCancelled correctly', () => {
    const { result } = renderHook(() => useCardsForPage());
    act(() => {
      result.current.setCardsData((draft) => {
        draft.activeId = 'id1';
      });
    });
    act(() => {
      result.current.onCancelled();
    });
    expect(result.current.cardsData.activeId).toBeNull();
  });
});
