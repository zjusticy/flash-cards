import { renderHook, act } from '@testing-library/react-hooks';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import useFileList from '../use-file-list';
import { auth } from '@/utils/firebase';
import { getLists, removeList, addLists } from '../api-file-list';
import { SWRConfig } from 'swr';
import useSWR from 'swr';

// Mock the external dependencies
vi.mock('@/utils/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
    },
  },
}));

vi.mock('../api-file-list', () => ({
  getLists: vi.fn(),
  removeList: vi.fn(),
  addLists: vi.fn(),
}));

vi.mock('swr');

describe('useFileList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  // const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  //   <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  // );

  it('should fetch lists when user is authenticated', async () => {
    const mockLists = ['list1', 'list2'];
    vi.mocked(getLists).mockResolvedValue(mockLists);

    const mockedUseSWR = useSWR as jest.Mock;
    // Mock the useSWR hook to return the mock data
    mockedUseSWR.mockReturnValue({
      data: mockLists,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    });
    const { result } = renderHook(() => useFileList());

    expect(result.current.cardLists).toEqual(mockLists);
  });

  it('should delete a list', async () => {
    const mockLists = ['list1', 'list2'];
    vi.mocked(getLists).mockResolvedValue(mockLists);
    vi.mocked(removeList).mockResolvedValue(null);
    const mockMutate = vi.fn();

    const mockedUseSWR = useSWR as jest.Mock;
    // Mock the useSWR hook to return the mock data
    mockedUseSWR.mockReturnValue({
      data: mockLists,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useFileList());

    await act(async () => {
      result.current.delelteList('list1');
    });

    expect(removeList).toHaveBeenCalledWith('list1');
    expect(mockMutate).toHaveBeenCalled();
    expect(localStorage.getItem('lists')).toBe(JSON.stringify(['list2']));
    expect(localStorage.getItem('memoryBoardlist1')).toBeNull();
  });

  it('should add a new list', async () => {
    const mockLists = ['list1'];
    const mockMutate = vi.fn();
    vi.mocked(addLists).mockResolvedValue(undefined);
    const mockedUseSWR = useSWR as jest.Mock;
    // Mock the useSWR hook to return the mock data
    mockedUseSWR.mockReturnValue({
      data: mockLists,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useFileList());

    act(() => {
      result.current.addList('list2');
    });

    expect(addLists).toHaveBeenCalledWith('list2', expect.any(String));
    expect(localStorage.getItem('lists')).toBe(
      JSON.stringify(['list2', 'list1'])
    );
  });

  it('should not add an empty list', async () => {
    const mockLists = ['list1'];
    const mockMutate = vi.fn();
    const mockedUseSWR = useSWR as jest.Mock;
    // Mock the useSWR hook to return the mock data
    mockedUseSWR.mockReturnValue({
      data: mockLists,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useFileList());

    act(() => {
      result.current.addList('');
    });

    expect(addLists).not.toHaveBeenCalled();
    expect(localStorage.getItem('lists')).toBeNull();
  });

  it('should not add a duplicate list', async () => {
    const mockLists = ['list1'];
    const mockMutate = vi.fn();
    const mockedUseSWR = useSWR as jest.Mock;
    // Mock the useSWR hook to return the mock data
    mockedUseSWR.mockReturnValue({
      data: mockLists,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useFileList());

    act(() => {
      result.current.addList('list1');
    });

    expect(addLists).not.toHaveBeenCalled();
    expect(localStorage.getItem('lists')).toBeNull();
  });
});
