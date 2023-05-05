import { auth, database } from "../../../components/Firebase/firebase";

export default function removeLists(name: string): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    const updates: any = {};
    updates[`userData/${userId}/lists/${name}`] = null;
    updates[`userData/${userId}/${name}`] = null;
    return database.ref().update(updates);
  }
  return undefined;
}
