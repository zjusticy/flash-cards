import { useEffect } from "react";
import { useRouter } from "next/router";

import MemoryBoardComponent from "@/features/memory-card/memory-board";
import { useCardStore } from "@/store/zustand";
import PageLayout from "@/features/layout/pageLayout";

const MemoryBoard: React.FC<{}> = () => {
  const { isAuth } = useCardStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  }, [isAuth]);

  const { slug } = router.query;
  return (
    <PageLayout localDB={false}>
      {slug ? (
        <MemoryBoardComponent collectionSlug={slug as string} localDB={false} />
      ) : (
        "Can't find this card list"
      )}
    </PageLayout>
  );
};

export default MemoryBoard;
