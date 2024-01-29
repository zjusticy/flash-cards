import { useEffect } from "react";
import { useRouter } from "next/router";

import CardUpdateComponent from "@/features/memory-card/card-update";
import { useCardStore } from "@/store/zustand";
import PageLayout from "@/features/layout/pageLayout";

const CardCreator: React.FC<{}> = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <PageLayout localDB={true}>
      {slug ? (
        <CardUpdateComponent collectionSlug={slug as string} localDB={true} />
      ) : (
        "Can't find this card list"
      )}
    </PageLayout>
  );
};

export default CardCreator;
