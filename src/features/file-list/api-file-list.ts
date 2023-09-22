import { auth, database } from "utils/firebase";

export function addLists(name: string, id: string): Promise<any> {
  const userId = auth.currentUser && auth.currentUser.uid;
  return database.ref(`userData/${userId}/lists`).update({ [name]: id });
}

export function getLists(userId: string | null): Promise<any> {
  return database
    .ref(`userData/${userId}/lists`)
    .once("value")
    .then((snapshot) => {
      // for (const )
      const listNames = Object.keys(snapshot.val()).sort(
        (a, b) =>
          parseInt(snapshot.val()[b], 10) - parseInt(snapshot.val()[a], 10)
      );
      // console.log(snapshot.val());
      return listNames;
    });
}

export function removeList(name: string): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    const updates: any = {};
    updates[`userData/${userId}/lists/${name}`] = null;
    updates[`userData/${userId}/${name}`] = null;
    return database.ref().update(updates);
  }
  return undefined;
}
