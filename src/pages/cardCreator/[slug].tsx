import { useEffect } from "react";
import { useRouter } from "next/router";

import CardUpdateComponent from "@/features/memory-card/card-update";
import { useCardStore } from "@/store/zustand";
import PageLayout from "@/features/layout/pageLayout";

const CardCreator: React.FC<{}> = () => {
  const router = useRouter();
  const { isAuth } = useCardStore();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  }, [isAuth]);

  const { slug } = router.query;

  return (
    <PageLayout localDB={false}>
      {slug ? (
        <CardUpdateComponent collectionSlug={slug as string} localDB={false} />
      ) : (
        "Can't find this card list"
      )}
    </PageLayout>
  );
};

export default CardCreator;
