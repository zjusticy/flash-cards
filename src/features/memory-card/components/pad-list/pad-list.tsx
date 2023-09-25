import * as React from "react";
import { FunctionComponent } from "react";
import Button from "features/ui/button/button";
import { CardType } from "features/memory-card/types-memory-card";
import Card from "features/memory-card/components/list-card/list-card";
import { useGlobalContext, CardsDataType } from "store/store";
import { WritableDraft } from "immer/dist/types/types-external";

import styles from "./pad-list.module.scss";

const PadList: FunctionComponent<{
  setUpdate: (front: string, back: string) => void;
  addToggled: () => void;
  cardsData: CardsDataType;
  setCardsData: (
    f: (draft: WritableDraft<CardsDataType>) => void | CardsDataType
  ) => void;
  onCancelled: () => void;
}> = ({ setUpdate, addToggled, cardsData, setCardsData, onCancelled }) => {
  const { setDrawerVisibility } = useGlobalContext();

  const { cardsCache, activeId, sortedIds } = cardsData;

  const padClickedHanlder = (card: CardType) => {
    if (card.id)
      setCardsData((draft) => {
        draft.activeId = card.id;
      });

    setUpdate(card.frontValue, card.backValue);
  };

  return (
    <div className={styles.padList}>
      <div className={styles.btnWrapper}>
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          clicked={() => {
            onCancelled();
            addToggled();
            setDrawerVisibility(false);
          }}
        >
          NEW
        </Button>
      </div>
      {cardsCache &&
        sortedIds.length > 0 &&
        sortedIds.map((id, index) => (
          <Card
            index={index}
            key={id}
            title={cardsCache[id].title}
            front={cardsCache[id].frontValue}
            active={activeId ? activeId === id : false}
            clicked={() => padClickedHanlder(cardsCache[id])}
          />
        ))}
    </div>
  );
};

export default PadList;
