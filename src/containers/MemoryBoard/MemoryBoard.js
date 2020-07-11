import React, { Component } from "react";
// import {Link} from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
// import {withRouter} from "react-router-dom";

import { withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./MemoryBoard.module.scss";

import Button from "../../components/UI/Button/Button";
import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
import Layout from "../../hoc/Layout/Layout";

import { initCards } from "../../store/cards";

import goPre from "../../assets/images/leftArrow.png";
import goNext from "../../assets/images/rightArrow.png";

import { auth, database } from "../../components/Firebase/firebase";

// import lock from '../../assets/images/locker.png';
import CodeBlock from "../../components/CodeBlock/codeBlock";

class MemoryBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memName: "",
      memId: null,
      memIndex: null,
      flashBack: null,
      activeList: [],
      backUpList: [],
      again: true,
      hide: true,
      traceBack: false,
      done: false,
    };
  }

  componentDidMount() {
    this._loadCards();
  }

  // Show or hide flash card's answer
  _showToggled = () => {
    this.setState((prevState) => {
      return { hide: !prevState.hide };
    });
  };

  /**
   * Use to set the cards parameters for init
   * @param {object[]} idLists
   * @param {string} name
   */
  _setCards = (idLists, name) => {
    if (idLists.length > 0) {
      const cardIds = this._shuffle(idLists);

      const updateBoard = {
        listName: name,
        listA: cardIds,
        listB: [],
        // activeId: cards[0].id};
        activeId: cardIds[0],
      };

      localStorage.setItem(`memoryBoard${name}`, JSON.stringify(updateBoard));

      this.setState({
        memName: name,
        memIndex: 0,
        memId: cardIds[0],
        activeList: cardIds,
      });
    } else {
      this.setState({
        memIndex: null,
      });
    }
  };

  /**
   * Move to the next card
   * @param {boolean} easy
   * @param {boolean} arrow
   * @return {none}
   */
  _showNext = (easy, arrow) => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };

    // Senario when showing the traceback item
    if (this.state.traceBack) {
      const originId = this.state.activeList[this.state.memIndex];

      // If click the right arrow
      if (arrow) {
        this.setState({
          // orderForm: updatedOrderForm,
          memId: originId,
          again: true,
          traceBack: false,
        });
      }
      // If click the again button
      else if (!easy) {
        this.setState((prevState) => {
          // orderForm: updatedOrderForm,
          const newList = [...prevState.backUpList];
          newList.splice(
            Math.floor(Math.random() * newList.length),
            0,
            // {
            prevState.flashBack.id
          );
          const newFlashBack = {
            ...prevState.flashBack,
            again: true,
          };
          return {
            memId: originId,
            backUpList: newList,
            flashBack: newFlashBack,
            again: true,
            traceBack: false,
          };
        });
      }
      // If click the easy button
      else {
        const newFlashBack = {
          ...this.state.flashBack,
          again: false,
        };

        if (this.state.backUpList.length > 0) {
          this.setState((prevState) => {
            const newList = prevState.backUpList.filter(
              (id) => id !== prevState.flashBack.id
            );
            return {
              memId: originId,
              flashBack: newFlashBack,
              backUpList: newList,
              again: true,
              traceBack: false,
            };
          });
        } else {
          this.setState((prevState) => {
            const newList = prevState.activeList.filter(
              (id) => id !== prevState.flashBack.id
            );
            return {
              memId: originId,
              flashBack: newFlashBack,
              activeList: newList,
              again: true,
              traceBack: false,
            };
          });
        }
      }
    }
    // Not reaching the last card and not in traceback page
    else if (this.state.memIndex < this.state.activeList.length - 1) {
      const activeIndex = this.state.memIndex + 1;
      const newId = this.state.activeList[activeIndex];
      const oldId = this.state.memId;
      // Click the right arrow
      if (!easy) {
        this.setState((prevState) => {
          const newList = [...prevState.backUpList];
          newList.splice(
            Math.floor(Math.random() * newList.length),
            0,
            prevState.memId
          );
          const newFlashBack = {
            again: true,
            id: oldId,
          };
          return {
            memIndex: activeIndex,
            memId: newId,
            hide: true,
            backUpList: newList,
            flashBack: newFlashBack,
          };
        });
      }
      // Click the easy button
      else {
        const newFlashBack = {
          again: false,
          id: oldId,
        };
        this.setState({
          // orderForm: updatedOrderForm,
          memIndex: activeIndex,
          hide: true,
          memId: newId,
          flashBack: newFlashBack,
        });
      }
    }
    // Reach the final one
    else {
      const oldId = this.state.memId;
      const newList = [...this.state.backUpList];
      // Click the right arrow
      if (!easy) {
        // If the back up list is empty
        if (newList.length === 0) {
          this.setState({ hide: true });
        }
        // Back up list is not empty
        else {
          newList.splice(
            Math.floor(Math.random() * (newList.length - 1) + 1),
            0,
            // {...this.state.activeList[this.state.memIndex]});
            this.state.memId
          );

          const newId = newList[0];
          const newFlashBack = {
            // title: this._showTitle(this.state.orderForm.front.value) || 'Card',
            // front: this.state.orderForm.front.value,
            // back: this.state.orderForm.back.value,
            again: true,
            // id: this.state.activeList[this.state.memIndex].id
            id: oldId,
          };
          this.setState({
            // orderForm: updatedOrderForm,
            memIndex: 0,
            memId: newId,
            hide: true,
            flashBack: newFlashBack,
            activeList: newList,
            backUpList: [],
          });
        }
      }
      // Click easy button
      else if (newList.length > 0) {
        const newId = newList[0];

        const newFlashBack = {
          again: false,
          // id: this.state.activeList[this.state.memIndex].id
          id: oldId,
        };

        this.setState({
          // orderForm: updatedOrderForm,
          memIndex: 0,
          memId: newId,
          hide: true,
          flashBack: newFlashBack,
          activeList: newList,
          backUpList: [],
        });
      } else {
        // console.log(`memoryBoard${this.props.match.params.name}`)
        localStorage.removeItem(`memoryBoard${this.props.match.params.name}`);
        // this.props.history.replace('/done');
        this.setState({ done: true });
      }
    }
  };

  // Show previous card
  _showPrev = () => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };
    if (this.state.traceBack === false && this.state.flashBack) {
      this.setState((prevState) => {
        // orderForm: updatedOrderForm,
        return {
          memId: prevState.flashBack.id,
          hide: true,
          again: prevState.flashBack.again,
          traceBack: true,
        };
      });
    }
  };

  // go to home page
  _goHome = () => {
    this.props.history.push("/");
  };

  // Load cards when init
  _loadCards = async () => {
    // let cards = null;
    // Get the name from URL
    if (this.props.match.params && this.props.match.params.name) {
      // Load the last record of memory board
      let myBoard = localStorage.getItem(
        `memoryBoard${this.props.match.params.name}`
      );
      // If myBoard exist
      if (myBoard) {
        myBoard = JSON.parse(myBoard);
        // cards not exist in cache
        if (!Object.keys(this.props.cardsCache).includes(myBoard.listName)) {
          try {
            const userId = auth.currentUser.uid;
            const snapshot = await database
              .ref(`userData/${userId}/${myBoard.listName}`)
              .once("value");
            if (snapshot.val()) {
              // const cardIds = Object.keys(snapshot.val());
              this.props.initCards(snapshot.val(), myBoard.listName, [], null);
            } else {
              this.props.initCards({}, myBoard.listName, [], null);
            }
          } catch (error) {
            // console.error("Error adding document: ", error);
          }
        }

        const activeIndex = myBoard.listA.indexOf(myBoard.activeId);

        this.setState({
          // orderForm: updatedOrderForm,
          memName: myBoard.listName,
          memIndex: activeIndex,
          memId: myBoard.activeId,
          activeList: myBoard.listA,
          backUpList: myBoard.listB,
        });
      }
      // myBoard not exist, initialize it

      // If cards is not in cache, fetch them
      else if (
        !Object.keys(this.props.cardsCache).includes(
          this.props.match.params.name
        )
      ) {
        try {
          const userId = auth.currentUser.uid;
          const snapshot = await database
            .ref(`userData/${userId}/${this.props.match.params.name}`)
            .once("value");
          if (snapshot.val()) {
            const cardIds = Object.keys(snapshot.val());
            this.props.initCards(
              snapshot.val(),
              this.props.match.params.name,
              [],
              null
            );
            this._setCards(cardIds, this.props.match.params.name);
          } else {
            this.props.initCards({}, this.props.match.params.name, [], null);
          }
        } catch (error) {
          // console.error("Error adding document: ", error);
        }
      } else {
        this._setCards(
          Object.keys(this.props.cardsCache[this.props.match.params.name]),
          this.props.match.params.name
        );
      }
    }
  };

  /**
   * Use to reorder the cards
   * @param {object[]} input
   * @return {object[]}
   */
  _shuffle = (input) => {
    for (let j, x, i = input.length; i > 0; ) {
      j = Math.floor(Math.random() * i);
      i -= 1;
      x = input[i];
      input[i] = input[j];
      input[j] = x;
    }
    return input;
  };

  render() {
    const { cardsCache, mode } = this.props;

    const objExi =
      Object.prototype.hasOwnProperty.call(cardsCache, this.state.memName) &&
      Object.prototype.hasOwnProperty.call(
        cardsCache[this.state.memName],
        this.state.memId
      );

    const frontPad =
      (objExi && cardsCache[this.state.memName][this.state.memId].frontValue) ||
      "";

    const backPad =
      (objExi && cardsCache[this.state.memName][this.state.memId].backValue) ||
      "";

    let donePage = this.state.done ? (
      <>
        <div className={styles.cardShowDouble} />
        <div className={styles.cardShowDouble}>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
        </div>
      </>
    ) : (
      <>
        <div className={`${styles.cardShowDouble} ${styles.markdownStyle}`}>
          <ReactMarkdown source={frontPad} renderers={{ code: CodeBlock }} />
        </div>
        <div
          className={
            this.state.hide
              ? `${styles.cardShowDouble} ${styles.locked}`
              : `${styles.cardShowDouble} ${styles.markdownStyle}`
          }
        >
          {this.state.hide ? null : (
            <ReactMarkdown source={backPad} renderers={{ code: CodeBlock }} />
          )}
        </div>
      </>
    );

    if (mode) {
      donePage = this.state.done ? (
        <div className={styles.cardShowSingle}>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
        </div>
      ) : (
        <div className={`${styles.cardShowSingle} ${styles.markdownStyle}`}>
          <ReactMarkdown
            source={this.state.hide ? frontPad : backPad}
            renderers={{ code: CodeBlock }}
          />
        </div>
      );
    }

    const buttons = this.state.done ? (
      <Button
        btnType="Success"
        size="Medium"
        clicked={this._goHome}
        elementType="normal"
      >
        HOME
      </Button>
    ) : (
      <>
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          clicked={
            this.state.again
              ? () => this._showNext(true, false)
              : () => this._showNext(false, false)
          }
        >
          {this.state.again ? "EASY" : "AGAIN"}
        </Button>
        <Button
          btnType="Success"
          size="Medium"
          clicked={this._showToggled}
          elementType="normal"
        >
          {this.state.hide ? "SHOW" : "HIDE"}
        </Button>
      </>
    );

    return (
      <Layout home>
        <div className={styles.memShowWrapper}>
          <Button
            className={styles.imgWrapperL}
            clicked={this._showPrev}
            elementType="normal"
          >
            <img src={goPre} alt="Go Previous" />
          </Button>
          <div className={styles.padShowWrapper}>
            <CardsWrapper memBoard mode={mode} preview={false}>
              {donePage}
            </CardsWrapper>
            <div className={styles.btnWrapper}>{buttons}</div>
          </div>
          <Button
            className={styles.imgWrapperR}
            clicked={() => this._showNext(false, true)}
            elementType="normal"
          >
            <img src={goNext} alt="Go Next" />
          </Button>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cardsCache: state.cards.cardsCache,
    // activeListName: state.cards.activeListName,
    // activeId: state.cards.activeId,
    mode: state.cards.modeS,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initCards: (cards, listName, ids, id) => {
      dispatch(initCards(cards, listName, ids, id));
    },
  };
};

// export default connect(null, mapDispatchToProps)(PadShow(AddCard, false));
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MemoryBoard));

MemoryBoard.propTypes = {
  cardsCache: PropTypes.objectOf(
    PropTypes.shape({
      frontValue: PropTypes.string,
      backValue: PropTypes.string,
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  mode: PropTypes.bool.isRequired,
  initCards: PropTypes.func.isRequired,
};
