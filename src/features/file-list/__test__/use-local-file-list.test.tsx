import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import useLocalFileList from '../use-local-file-list';
import localforage from 'localforage';

vi.mock('localforage');

describe('useLocalFileList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with an empty file list', async () => {
    vi.mocked(localforage.getItem).mockResolvedValue(null);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLocalFileList());

    // Wait for setItem to be called
    await vi.waitFor(
      () => {
        expect(localforage.setItem).toHaveBeenCalledWith('fileList', []);
      },
      { timeout: 1000 }
    );

    expect(result.current.fileList).toEqual([]);
    expect(result.current.error).toBe('');
    expect(result.current.actionError).toBe('');
  });

  it('should load existing file list', async () => {
    const mockFileList = ['file1', 'file2'];
    vi.mocked(localforage.getItem).mockResolvedValue(mockFileList);

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    expect(result.current.fileList).toEqual(mockFileList);
    expect(result.current.error).toBe('');
  });

  it('should handle error when loading file list', async () => {
    vi.mocked(localforage.getItem).mockRejectedValue(new Error('Load error'));

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    expect(result.current.error).toBe('err');
  });

  it('should add a new list', async () => {
    const initialList = ['file1'];
    vi.mocked(localforage.getItem).mockResolvedValue(initialList);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    act(() => {
      result.current.addList('file2');
    });

    await waitForNextUpdate();

    expect(result.current.fileList).toEqual(['file2', 'file1']);
    expect(localforage.setItem).toHaveBeenCalledWith('fileList', [
      'file2',
      'file1',
    ]);
    expect(localforage.setItem).toHaveBeenCalledWith('file2', {});
  });

  it('should not add an empty list name', async () => {
    const initialList = ['file1'];
    vi.mocked(localforage.getItem).mockResolvedValue(initialList);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    act(() => {
      result.current.addList('');
    });

    expect(result.current.fileList).toEqual(['file1']);
    expect(localforage.setItem).not.toHaveBeenCalled();
  });

  it('should delete a list', async () => {
    const initialList = ['file1', 'file2'];
    vi.mocked(localforage.getItem).mockResolvedValue(initialList);
    vi.mocked(localforage.setItem).mockResolvedValue(undefined);
    vi.mocked(localforage.removeItem).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    act(() => {
      result.current.delelteList('file1');
    });

    await waitForNextUpdate();

    expect(result.current.fileList).toEqual(['file2']);
    expect(localforage.setItem).toHaveBeenCalledWith('fileList', ['file2']);
    expect(localforage.removeItem).toHaveBeenCalledWith('file1');
  });

  it('should handle error when deleting a list', async () => {
    const initialList = ['file1', 'file2'];
    vi.mocked(localforage.getItem).mockResolvedValue(initialList);
    vi.mocked(localforage.setItem).mockRejectedValue(new Error('Delete error'));

    const { result, waitForNextUpdate } = renderHook(() => useLocalFileList());

    await waitForNextUpdate();

    act(() => {
      result.current.delelteList('file1');
    });

    await waitForNextUpdate();

    expect(result.current.actionError).toBe('Delete action failed');
  });
});
