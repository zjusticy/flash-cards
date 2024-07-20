import { useEffect, useState, useCallback } from 'react';
import localforage from 'localforage';

export default function useLocalFileList() {
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [fileList, setFileList] = useState<string[]>([]);

  const getList = useCallback(async () => {
    try {
      const value = await localforage.getItem('fileList');
      // This code runs once the value has been loaded
      // from the offline store.
      if (!value) {
        await localforage.setItem('fileList', []);
        return;
      }
      setFileList(value as string[]);
    } catch (err) {
      // This code runs if there were any errors.
      setError('err');
    }
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  const delelteList = useCallback(
    async (_listName: string) => {
      try {
        const newLists = fileList.filter((list) => list !== _listName);
        await localforage.setItem('fileList', newLists);
        await localforage.removeItem(_listName);
        // This code runs once the value has been loaded
        // from the offline store.
        setFileList(newLists);
      } catch (err) {
        // This code runs if there were any errors.
        setActionError('Delete action failed');
      }
    },
    [fileList]
  );

  const addList = useCallback(
    async (_listName: string) => {
      try {
        if (!fileList || fileList.indexOf(_listName) !== -1) {
          return;
        }
        if (_listName.trim() === '') {
          return;
        }
        const newList = [_listName, ...fileList];
        await localforage.setItem('fileList', newList);
        await localforage.setItem(_listName, {});
        setFileList(newList);
      } catch (err) {
        // This code runs if there were any errors.
        setActionError('Add action failed');
      }
    },
    [fileList]
  );

  return {
    fileList,
    error,
    actionError,
    delelteList,
    addList,
  };
}
