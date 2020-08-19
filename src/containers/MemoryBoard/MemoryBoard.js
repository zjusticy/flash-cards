import React, { useState, useEffect } from "react";
// import {Link} from 'react-router-dom';

import { useRouteMatch, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./MemoryBoard.module.scss";

import Button from "../../components/UI/Button/Button";
import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
import Layout from "../../hoc/Layout/Layout";

import useCards from "../../hooks/useCards";

import goPre from "../../assets/images/leftArrow.png";
import goNext from "../../assets/images/rightArrow.png";

import { auth, database } from "../../components/Firebase/firebase";

// import lock from '../../assets/images/locker.png';
import CodeBlock from "../../components/CodeBlock/codeBlock";

const memInit = {
  memName: "",
  memId: null,
  memIndex: null,
  flashBack: null,
  activeList: [],
  backUpList: [],
  again: true,
  traceBack: false,
  done: false,
};

/**
 * Use to reorder the cards
 * @param {object[]} input
 * @return {object[]}
 */
const _shuffle = (input) => {
  for (let j, x, i = input.length; i > 0; ) {
    j = Math.floor(Math.random() * i);
    i -= 1;
    x = input[i];
    input[i] = input[j];
    input[j] = x;
  }
  return input;
};

const MemoryBoard = () => {
  const [memState, changeMemState] = useState(memInit);

  const [hide, flipHide] = useState(true);

  const { modeS, cardsCache, onInitCards } = useCards();

  const match = useRouteMatch();

  const history = useHistory();

  useEffect(() => {
    /**
     * Use to set the cards parameters for init
     * @param {object[]} idLists
     * @param {string} name
     */
    const _setCards = (idLists, name) => {
      if (idLists.length > 0) {
        const cardIds = _shuffle(idLists);

        const updateBoard = {
          listName: name,
          listA: cardIds,
          listB: [],
          // activeId: cards[0].id};
          activeId: cardIds[0],
        };

        localStorage.setItem(`memoryBoard${name}`, JSON.stringify(updateBoard));

        changeMemState((prevState) => {
          return {
            ...prevState,
            memName: name,
            memIndex: 0,
            memId: cardIds[0],
            activeList: cardIds,
          };
        });
      } else {
        changeMemState((prevState) => {
          return {
            ...prevState,
            memIndex: null,
          };
        });
      }
    };

    // Load cards when init
    const _loadCards = async () => {
      // let cards = null;
      // Get the name from URL
      if (match.params && match.params.name) {
        // Load the last record of memory board
        let myBoard = localStorage.getItem(`memoryBoard${match.params.name}`);
        // If myBoard exist
        if (myBoard) {
          myBoard = JSON.parse(myBoard);
          // cards not exist in cache
          if (!Object.keys(cardsCache).includes(myBoard.listName)) {
            try {
              const userId = auth.currentUser.uid;
              const snapshot = await database
                .ref(`userData/${userId}/${myBoard.listName}`)
                .once("value");
              if (snapshot.val()) {
                // const cardIds = Object.keys(snapshot.val());
                onInitCards(snapshot.val(), myBoard.listName, [], null);
              } else {
                onInitCards({}, myBoard.listName, [], null);
              }
            } catch (error) {
              // console.error("Error adding document: ", error);
            }
          }

          const activeIndex = myBoard.listA.indexOf(myBoard.activeId);

          changeMemState((prevState) => {
            return {
              ...prevState,
              memName: myBoard.listName,
              memIndex: activeIndex,
              memId: myBoard.activeId,
              activeList: myBoard.listA,
              backUpList: myBoard.listB,
            };
          });
        }
        // myBoard not exist, initialize it

        // If cards is not in cache, fetch them
        else if (!Object.keys(cardsCache).includes(match.params.name)) {
          try {
            const userId = auth.currentUser.uid;
            const snapshot = await database
              .ref(`userData/${userId}/${match.params.name}`)
              .once("value");
            if (snapshot.val()) {
              const cardIds = Object.keys(snapshot.val());
              onInitCards(snapshot.val(), match.params.name, [], null);
              _setCards(cardIds, match.params.name);
            } else {
              onInitCards({}, match.params.name, [], null);
            }
          } catch (error) {
            // console.error("Error adding document: ", error);
          }
        } else {
          _setCards(
            Object.keys(cardsCache[match.params.name]),
            match.params.name
          );
        }
      }
    };
    _loadCards();
  }, [
    match.params,
    match.params.name,
    cardsCache,
    onInitCards,
    changeMemState,
  ]);

  // Show or hide flash card's answer
  const _showToggled = () => {
    flipHide((prevState) => !prevState);
  };

  /**
   * Move to the next card
   * @param {boolean} easy
   * @param {boolean} arrow
   * @return {none}
   */
  const _showNext = (easy, arrow) => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };

    // Senario when showing the traceback item
    if (memState.traceBack) {
      // If click the right arrow
      if (arrow) {
        changeMemState((prevState) => {
          return {
            ...prevState,
            memId: prevState.activeList[prevState.memIndex],
            again: true,
            traceBack: false,
          };
        });
      }
      // If click the again button
      else if (!easy) {
        changeMemState((prevState) => {
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
            ...prevState,
            memId: prevState.activeList[prevState.memIndex],
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
          ...memState.flashBack,
          again: false,
        };

        if (memState.backUpList.length > 0) {
          changeMemState((prevState) => {
            const newList = prevState.backUpList.filter(
              (id) => id !== prevState.flashBack.id
            );
            return {
              ...prevState,
              memId: prevState.activeList[prevState.memIndex],
              flashBack: newFlashBack,
              backUpList: newList,
              again: true,
              traceBack: false,
            };
          });
        } else {
          changeMemState((prevState) => {
            const newList = prevState.activeList.filter(
              (id) => id !== prevState.flashBack.id
            );
            return {
              ...prevState,
              memId: prevState.activeList[prevState.memIndex],
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
    else if (memState.memIndex < memState.activeList.length - 1) {
      // const activeIndex = memState.memIndex + 1;
      // const newId = memState.activeList[activeIndex];
      // const oldId = memState.memId;
      // Click the right arrow
      if (!easy) {
        changeMemState((prevState) => {
          const activeIndex = prevState.memIndex + 1;
          const newId = prevState.activeList[activeIndex];
          const oldId = prevState.memId;
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
            ...prevState,
            memIndex: activeIndex,
            memId: newId,
            backUpList: newList,
            flashBack: newFlashBack,
          };
        });
        flipHide(true);
      }
      // Click the easy button
      else {
        changeMemState((prevState) => {
          const activeIndex = prevState.memIndex + 1;
          const newId = prevState.activeList[activeIndex];
          const oldId = prevState.memId;

          const newFlashBack = {
            again: false,
            id: oldId,
          };
          return {
            ...prevState,
            memIndex: activeIndex,
            memId: newId,
            flashBack: newFlashBack,
          };
        });
        flipHide(true);
      }
    }
    // Reach the final one, Click the right arrow
    else if (!easy) {
      // If the back up list is empty
      if ([...memState.backUpList].length === 0) {
        flipHide(true);
      }
      // Back up list is not empty
      else {
        changeMemState((prevState) => {
          const newList = [...prevState.backUpList];
          newList.splice(
            Math.floor(Math.random() * (newList.length - 1) + 1),
            0,
            // {...this.state.activeList[this.state.memIndex]});
            prevState.memId
          );
          const oldId = prevState.memId;
          const newId = newList[0];
          const newFlashBack = {
            // title: this._showTitle(this.state.orderForm.front.value) || 'Card',
            // front: this.state.orderForm.front.value,
            // back: this.state.orderForm.back.value,
            again: true,
            // id: this.state.activeList[this.state.memIndex].id
            id: oldId,
          };
          return {
            ...prevState,
            memIndex: 0,
            memId: newId,
            flashBack: newFlashBack,
            activeList: newList,
            backUpList: [],
          };
        });
        flipHide(true);
      }
    }
    // Click easy button
    else if ([...memState.backUpList].length > 0) {
      changeMemState((prevState) => {
        const newList = [...prevState.backUpList];
        const newId = newList[0];
        const oldId = prevState.memId;

        const newFlashBack = {
          again: false,
          // id: this.state.activeList[this.state.memIndex].id
          id: oldId,
        };

        return {
          ...prevState,
          memIndex: 0,
          memId: newId,
          hide: true,
          flashBack: newFlashBack,
          activeList: newList,
          backUpList: [],
        };
      });
      flipHide(true);
    } else {
      localStorage.removeItem(`memoryBoard${match.params.name}`);
      changeMemState((prevState) => {
        return { ...prevState, done: true };
      });
    }
  };

  // Show previous card
  const _showPrev = () => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };
    if (memState.traceBack === false && memState.flashBack) {
      changeMemState((prevState) => {
        // orderForm: updatedOrderForm,
        return {
          ...prevState,
          memId: prevState.flashBack.id,
          again: prevState.flashBack.again,
          traceBack: true,
        };
      });
      flipHide(true);
    }
  };

  // go to home page
  const _goHome = () => {
    history.push("/");
  };

  const objExi =
    Object.prototype.hasOwnProperty.call(cardsCache, memState.memName) &&
    Object.prototype.hasOwnProperty.call(
      cardsCache[memState.memName],
      memState.memId
    );

  const frontPad =
    (objExi && cardsCache[memState.memName][memState.memId].frontValue) || "";

  const backPad =
    (objExi && cardsCache[memState.memName][memState.memId].backValue) || "";

  let donePage = memState.done ? (
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
          hide
            ? `${styles.cardShowDouble} ${styles.locked}`
            : `${styles.cardShowDouble} ${styles.markdownStyle}`
        }
      >
        {hide ? null : (
          <ReactMarkdown source={backPad} renderers={{ code: CodeBlock }} />
        )}
      </div>
    </>
  );

  if (modeS) {
    donePage = memState.done ? (
      <div className={styles.cardShowSingle}>
        <p className={styles.doneText}>CLEAR !</p>
        <p className={styles.doneText}>CLEAR !</p>
        <p className={styles.doneText}>CLEAR !</p>
      </div>
    ) : (
      <div className={`${styles.cardShowSingle} ${styles.markdownStyle}`}>
        <ReactMarkdown
          source={hide ? frontPad : backPad}
          renderers={{ code: CodeBlock }}
        />
      </div>
    );
  }

  const buttons = memState.done ? (
    <Button
      btnType="Success"
      size="Medium"
      clicked={_goHome}
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
          memState.again
            ? () => _showNext(true, false)
            : () => _showNext(false, false)
        }
      >
        {memState.again ? "EASY" : "AGAIN"}
      </Button>
      <Button
        btnType="Success"
        size="Medium"
        clicked={_showToggled}
        elementType="normal"
      >
        {hide ? "SHOW" : "HIDE"}
      </Button>
    </>
  );

  return (
    <Layout home>
      <div className={styles.memShowWrapper}>
        <Button
          className={styles.imgWrapperL}
          clicked={_showPrev}
          elementType="normal"
        >
          <img src={goPre} alt="Go Previous" />
        </Button>
        <div className={styles.padShowWrapper}>
          <CardsWrapper memBoard mode={modeS} preview={false}>
            {donePage}
          </CardsWrapper>
          <div className={styles.btnWrapper}>{buttons}</div>
        </div>
        <Button
          className={styles.imgWrapperR}
          clicked={() => _showNext(false, true)}
          elementType="normal"
        >
          <img src={goNext} alt="Go Next" />
        </Button>
      </div>
    </Layout>
  );
};

// export default connect(null, mapDispatchToProps)(PadShow(AddCard, false));
export default MemoryBoard;
