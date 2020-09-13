import * as React from "react";
import { FunctionComponent } from "react";
import { CardType } from "../../types";

import styles from "./PadList.module.scss";

import Card from "../Card/Card";
import useCards from "../../hooks/useCards";

const PadList: FunctionComponent<{
  setUpdate: (front: string, back: string) => void;
}> = ({ setUpdate }) => {
  const {
    cardsCache,
    activeListName,
    activeId,
    sortedIds,
    onClickPad,
  } = useCards();

  const padClickedHanlder = (card: CardType) => {
    if (card.id) onClickPad(card.id);

    setUpdate(card.frontValue, card.backValue);
  };

  return (
    <div className={styles.padList}>
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
