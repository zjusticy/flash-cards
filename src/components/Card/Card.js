import React from "react";
import PropTypes from "prop-types";

import styles from "./Card.module.scss";

const card = (props) => {
  let attachedclasses = [styles.card];
  if (props.active) {
    attachedclasses = [styles.card, styles.active];
  }

  return (
    <div
      role="button"
      className={attachedclasses.join(" ")}
      onClick={props.clicked}
      tabIndex={props.index}
    >
      <h2>{props.title}</h2>
      <p>{props.front}</p>
    </div>
  );
};

export default card;

card.propTypes = {
  active: PropTypes.bool.isRequired,
  clicked: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  front: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
