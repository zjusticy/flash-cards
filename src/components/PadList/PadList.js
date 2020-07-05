import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import styles from "./PadList.module.scss";

import Card from "../Card/Card";
import { clickPad } from "../../store/cards";

class PadList extends Component {
  padClickedHanlder = (card) => {
    this.props.clickCard(card.id);

    this.props.setUpdate(card.frontValue, card.backValue);
  };

  render() {
    return (
      <div className={styles.padList}>
        {this.props.sortedIds.length > 0 &&
          this.props.activeListName &&
          this.props.sortedIds.map((id, index) => (
            <Card
              index={index}
              key={id}
              title={this.props.cardsCache[this.props.activeListName][id].title}
              front={
                this.props.cardsCache[this.props.activeListName][id].frontValue
              }
              active={
                this.props.activeId
                  ? this.props.activeId === parseInt(id, 10)
                  : false
              }
              clicked={() =>
                this.padClickedHanlder(
                  this.props.cardsCache[this.props.activeListName][id]
                )
              }
            />
          ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cardsCache: state.cards.cardsCache,
    activeListName: state.cards.activeListName,
    activeId: state.cards.activeId,
    sortedIds: state.cards.sortedIds,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Add cards
    clickCard: (cardId) => {
      dispatch(clickPad(cardId));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PadList));

PadList.propTypes = {
  cardsCache: PropTypes.objectOf(
    PropTypes.shape({
      frontValue: PropTypes.string,
      backValue: PropTypes.string,
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  sortedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeListName: PropTypes.string.isRequired,
  activeId: PropTypes.number,
  clickCard: PropTypes.func.isRequired,
  setUpdate: PropTypes.func.isRequired,
};

PadList.defaultProps = {
  activeId: null,
};
