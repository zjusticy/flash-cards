import * as React from "react";
import { FunctionComponent } from "react";
import { CardType } from "../../../../types";

import styles from "./PadList.module.scss";

import Card from "../../../../components/Card/Card";
import Button from "../../../../components/UI/Button/Button";
// import useCards from "../../hooks/useCards.ts.bak";

import { useGlobalContext } from "../../../../store/store";
import useCards from "../../hooks/useCards";

const PadList: FunctionComponent<{
  setUpdate: (front: string, back: string) => void;
  addToggled: () => void;
}> = ({ setUpdate, addToggled }) => {
  // const {
  //   cardsCache,
  //   activeListName,
  //   activeId,
  //   sortedIds,
  //   onClickPad,
  // } = useCards();

  const { cardsData, setCardsData, setDrawerVisibility } = useGlobalContext();

  const {
    // cardsCache,
    // activeListName,
    // activeId,
    // modeE,
    onCancelled,
  } = useCards();

  const { cardsCache, activeListName, activeId, sortedIds } = cardsData;

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
      {sortedIds.length > 0 &&
        activeListName &&
        sortedIds.map((id, index) => (
          <Card
            index={index}
            key={id}
            title={cardsCache[activeListName][id].title}
            front={cardsCache[activeListName][id].frontValue}
            active={activeId ? activeId === id : false}
            clicked={() => padClickedHanlder(cardsCache[activeListName][id])}
          />
        ))}
    </div>
  );
};

export default PadList;
