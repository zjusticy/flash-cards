import { auth, database } from "../../../components/Firebase/firebase";

export default function removeCard(
  cardId: string,
  activeListName: string
): Promise<any> | undefined {
  const userId = auth.currentUser && auth.currentUser.uid;
  if (userId) {
    return database
      .ref(`userData/${userId}/${activeListName}/`)
      .update({ [cardId]: null });
  }
  return undefined;
}
