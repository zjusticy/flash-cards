import { auth, database } from "@/utils/firebase";
import { ref, child, get, update } from "firebase/database";

export function addLists(name: string, id: string): Promise<any> {
  const userId = auth.currentUser && auth.currentUser.uid;
  console.log(userId);
  return update(ref(database, `userData/${userId}/lists`), { [name]: id });
}

export function getLists(userId: string | null): Promise<any> {
  const dbRef = ref(database);
  return get(child(dbRef, `userData/${userId}/lists`)).then((snapshot) => {
    // for (const )
    const listNames = Object.keys(snapshot.val()).sort(
      (a, b) =>
        parseInt(snapshot.val()[b], 10) - parseInt(snapshot.val()[a], 10)
    );
    return listNames;
  });
}

export function removeList(name: string): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    const updates: any = {};
    updates[`userData/${userId}/lists/${name}`] = null;
    updates[`userData/${userId}/collections/${name}`] = null;
    return update(ref(database), updates);
  }
  return undefined;
}
