import { useEffect } from "react";
import { useRouter } from "next/router";

import MemoryBoardComponent from "@/features/memory-card/memory-board";
import { useCardStore } from "@/store/zustand";
import PageLayout from "@/features/layout/pageLayout";

const MemoryBoard: React.FC<{}> = () => {
  const router = useRouter();

  const { slug } = router.query;
  return (
    <PageLayout localDB={true}>
      {slug ? (
        <MemoryBoardComponent collectionSlug={slug as string} localDB={true} />
      ) : (
        "Can't find this card list"
      )}
    </PageLayout>
  );
};

export default MemoryBoard;
