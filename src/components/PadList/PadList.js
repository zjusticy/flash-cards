import React from "react";
import PropTypes from "prop-types";

import styles from "./PadList.module.scss";

import Card from "../Card/Card";
import useCards from "../../hooks/useCards";

const PadList = (props) => {
  const {
    cardsCache,
    activeListName,
    activeId,
    sortedIds,
    onClickPad,
  } = useCards();

  const padClickedHanlder = (card) => {
    onClickPad(card.id);

    props.setUpdate(card.frontValue, card.backValue);
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
            active={activeId ? activeId === parseInt(id, 10) : false}
            clicked={() => padClickedHanlder(cardsCache[activeListName][id])}
          />
        ))}
    </div>
  );
};

export default PadList;

PadList.propTypes = {
  setUpdate: PropTypes.func.isRequired,
};
