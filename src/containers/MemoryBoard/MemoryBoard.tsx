import { useState, useEffect } from "react";
import * as React from "react";
// import {Link} from 'react-router-dom';
import { useImmer } from "use-immer";

import { useParams, useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Tex from "@matejmazur/react-katex";
import math from "remark-math";
import styles from "./MemoryBoard.module.scss";

import Button from "../../components/UI/Button/Button";
import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
import Layout from "../../hoc/Layout/Layout";

import useCards from "../../hooks/useCards";

import goPre from "../../assets/images/leftArrow.png";
import goNext from "../../assets/images/rightArrow.png";

import { auth, database } from "../../components/Firebase/firebase";

import type { MemStateType } from "../../types";

// import lock from '../../assets/images/locker.png';
import CodeBlock from "../../components/CodeBlock/codeBlock";

type MemStore = {
  listName: string;
  listA: string[];
  listB: string[];
  // activeId: cards[0].id};
  activeId: string;
};

const memInit = {
  memName: "",
  memId: null,
  memIndex: 0,
  flashBack: null,
  activeList: [],
  backUpList: [],
  again: true,
  traceBack: false,
  done: false,
};

/**
 * Use to reorder the cards
 * @return {any[]}
 */
const shuffle = (input: any[]) => {
  for (let j, x, i = input.length; i > 0; ) {
    j = Math.floor(Math.random() * i);
    i -= 1;
    x = input[i];
    input[i] = input[j];
    input[j] = x;
  }
  return input;
};

/* eslint-disable*/
const renderers = {
  code: CodeBlock,
  inlineMath: ({ value }: { value: any }) => <Tex math={value} />,
  math: ({ value }: { value: any }) => <Tex block math={value} />,
};
/* eslint-enable */

const MemoryBoard = () => {
  const [memState, changeMemState] = useImmer<MemStateType>(memInit);

  const [side, flipSide] = useState<boolean>(true);

  const { modeS, cardsCache, onInitCards } = useCards();

  const history = useHistory();

  const { name } = useParams<{ name: string }>();

  useEffect(() => {
    // Use to set the cards parameters for init
    const setCards = (idLists: string[], listName: string) => {
      if (idLists.length > 0) {
        const cardIds = shuffle(idLists);

        const updateBoard: MemStore = {
          listName,
          listA: cardIds,
          listB: [],
          activeId: cardIds[0],
        };

        localStorage.setItem(`memoryBoard${name}`, JSON.stringify(updateBoard));

        changeMemState((draft) => {
          draft.memName = listName;
          draft.memIndex = 0;
          [draft.memId] = cardIds;
          draft.activeList = cardIds;
        });
      } else {
        changeMemState((draft) => {
          draft.memIndex = 0;
        });
      }
    };

    // Load cards when init
    const loadCards = async () => {
      // let cards = null;
      // Get the name from URL
      if (name) {
        // Load the last record of memory board
        const myBoardJ = localStorage.getItem(`memoryBoard${name}`);
        // If myBoard exist
        if (myBoardJ) {
          const myBoard: MemStore = JSON.parse(myBoardJ);
          // cards not exist in cache
          if (!Object.keys(cardsCache).includes(myBoard && myBoard.listName)) {
            try {
              const userId = auth.currentUser && auth.currentUser.uid;
              if (userId) {
                const snapshot = await database
                  .ref(`userData/${userId}/${myBoard.listName}`)
                  .once("value");
                if (snapshot.val()) {
                  // const cardIds = Object.keys(snapshot.val());
                  onInitCards(snapshot.val(), myBoard.listName, [], null);
                } else {
                  onInitCards({}, myBoard.listName, [], null);
                }
              }
            } catch (error) {
              // console.error("Error adding document: ", error);
            }
          }

          const activeIndex = myBoard.listA.indexOf(myBoard.activeId);

          changeMemState((draft) => {
            draft.memName = myBoard.listName;
            draft.memIndex = activeIndex;
            draft.memId = myBoard.activeId;
            draft.activeList = myBoard.listA;
            draft.backUpList = myBoard.listB;
          });
        }
        // myBoard not exist, initialize it

        // If cards is not in cache, fetch them
        else if (!Object.keys(cardsCache).includes(name)) {
          try {
            const userId = auth.currentUser && auth.currentUser.uid;
            if (userId) {
              const snapshot = await database
                .ref(`userData/${userId}/${name}`)
                .once("value");
              if (snapshot.val()) {
                const cardIds = Object.keys(snapshot.val());
                onInitCards(snapshot.val(), name, [], null);
                setCards(cardIds, name);
              } else {
                onInitCards({}, name, [], null);
              }
            }
          } catch (error) {
            // console.error("Error adding document: ", error);
          }
        } else {
          setCards(Object.keys(cardsCache[name]), name);
        }
      }
    };
    loadCards();
  }, [name, cardsCache, onInitCards, changeMemState]);

  /**
   * Move to the next card
   * @param {boolean} easy
   * @param {boolean} arrow
   * @return {none}
   */
  const showNext = (easy: boolean, arrow: boolean) => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };

    // Senario when showing the traceback item
    if (memState.traceBack) {
      // If click the right arrow
      if (arrow) {
        changeMemState((draft) => {
          draft.memId = draft.activeList[draft.memIndex];
          draft.again = true;
          draft.traceBack = false;
        });
        flipSide(true);
      }
      // If click the again button
      else if (!easy) {
        changeMemState((draft) => {
          if (draft.flashBack) {
            const newList = [...draft.backUpList];
            newList.splice(
              Math.floor(Math.random() * newList.length),
              0,
              draft.flashBack.id
            );
            draft.backUpList = newList;
            draft.flashBack.again = true;
          }
          draft.memId = draft.activeList[draft.memIndex];
          draft.again = true;
          draft.traceBack = false;
        });
        flipSide(true);
      }
      // If click the easy button
      else {
        if (memState.backUpList.length > 0) {
          changeMemState((draft) => {
            if (draft.flashBack) {
              const newList = draft.backUpList.filter(
                (id: string) => id !== draft.flashBack!.id
              );
              draft.backUpList = newList;
              draft.flashBack.again = false;
            }
            draft.memId = draft.activeList[draft.memIndex];
            draft.again = true;
            draft.traceBack = false;
          });
        } else {
          changeMemState((draft) => {
            if (draft.flashBack) {
              const newList = draft.activeList.filter(
                (id: string) => id !== draft.flashBack!.id
              );
              draft.backUpList = newList;
              draft.flashBack.again = false;
            }
            draft.memId = draft.activeList[draft.memIndex];
            draft.again = true;
            draft.traceBack = false;
          });
        }
        flipSide(true);
      }
    }
    // Not reaching the last card and not in traceback page
    else if (memState.memIndex < memState.activeList.length - 1) {
      // const activeIndex = memState.memIndex + 1;
      // const newId = memState.activeList[activeIndex];
      // const oldId = memState.memId;
      // Click the right arrow
      if (!easy) {
        changeMemState((draft) => {
          const activeIndex = draft.memIndex + 1;
          const newId = draft.activeList[activeIndex];
          const oldId = draft.memId;
          const newList = [...draft.backUpList];
          if (oldId) {
            draft.flashBack = {
              again: true,
              id: oldId,
            };
            newList.splice(
              Math.floor(Math.random() * newList.length),
              0,
              oldId
            );
            draft.backUpList = newList;
            draft.memIndex = activeIndex;
            draft.memId = newId;
          }
        });
        flipSide(true);
      }
      // Click the easy button
      else {
        changeMemState((draft) => {
          const activeIndex = draft.memIndex + 1;
          const newId = draft.activeList[activeIndex];
          const oldId = draft.memId;
          if (oldId) {
            const newFlashBack = {
              again: false,
              id: oldId,
            };
            draft.flashBack = newFlashBack;
            draft.memIndex = activeIndex;
            draft.memId = newId;
          }
        });
        flipSide(true);
      }
    }
    // Reach the final one, Click the right arrow
    else if (!easy) {
      // If the back up list is empty
      if ([...memState.backUpList].length === 0) {
        flipSide(true);
      }
      // Back up list is not empty
      else {
        changeMemState((draft) => {
          const oldId = draft.memId;
          if (oldId) {
            const newList = [...draft.backUpList];
            newList.splice(
              Math.floor(Math.random() * (newList.length - 1) + 1),
              0,
              // {...this.state.activeList[this.state.memIndex]});
              oldId
            );
            const newId = newList[0];

            const newFlashBack = {
              again: true,
              id: oldId,
            };
            draft.flashBack = newFlashBack;

            draft.memId = newId;
            draft.activeList = newList;

            draft.memIndex = 0;
            draft.backUpList = [];
          }
        });
        flipSide(true);
      }
    }
    // Click easy button
    else if ([...memState.backUpList].length > 0) {
      changeMemState((draft) => {
        const newList = [...draft.backUpList];
        const newId = newList[0];
        const oldId = draft.memId;
        if (oldId) {
          const newFlashBack = {
            again: false,
            // id: this.state.activeList[this.state.memIndex].id
            id: oldId,
          };

          draft.memIndex = 0;
          draft.memId = newId;
          draft.flashBack = newFlashBack;
          draft.activeList = newList;
          draft.backUpList = [];
        }
      });
      flipSide(true);
    } else {
      localStorage.removeItem(`memoryBoard${name}`);
      changeMemState((prevState) => {
        return { ...prevState, done: true };
      });
    }
  };

  // Show previous card
  const showPrev = () => {
    // const updatedOrderForm = {
    //    ...this.state.orderForm
    //  };
    if (memState.traceBack === false && memState.flashBack) {
      changeMemState((draft) => {
        // orderForm: updatedOrderForm,
        draft.memId = draft.flashBack!.id;
        draft.again = draft.flashBack!.again;
        draft.traceBack = true;
      });
      flipSide(true);
    }
  };

  // go to home page
  const goHome = () => {
    history.push("/");
  };

  const objExi =
    memState.memId &&
    Object.prototype.hasOwnProperty.call(cardsCache, memState.memName) &&
    Object.prototype.hasOwnProperty.call(
      cardsCache[memState.memName],
      memState.memId
    );

  const frontPad =
    (memState.memId &&
      objExi &&
      cardsCache[memState.memName][memState.memId].frontValue) ||
    "";

  const backPad =
    (memState.memId &&
      objExi &&
      cardsCache[memState.memName][memState.memId].backValue) ||
    "";

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
        <ReactMarkdown
          source={frontPad}
          plugins={[math]}
          renderers={renderers}
        />
      </div>
      <div
        className={
          side
            ? `${styles.cardShowDouble} ${styles.locked}`
            : `${styles.cardShowDouble} ${styles.markdownStyle}`
        }
      >
        {side ? null : (
          <ReactMarkdown
            source={backPad}
            plugins={[math]}
            renderers={renderers}
          />
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
          source={side ? frontPad : backPad}
          plugins={[math]}
          renderers={renderers}
        />
      </div>
    );
  }

  const buttons = memState.done ? (
    <Button
      btnType="Success"
      size="Medium"
      clicked={goHome}
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
            ? () => showNext(true, false)
            : () => showNext(false, false)
        }
      >
        {memState.again ? "EASY" : "AGAIN"}
      </Button>
      <Button
        btnType="Success"
        size="Medium"
        clicked={() => flipSide((prev) => !prev)}
        elementType="normal"
      >
        {side ? "SHOW" : "HIDE"}
      </Button>
    </>
  );

  return (
    <Layout home>
      <div className={styles.memBoard}>
        <div className={styles.memShowWrapper}>
          <Button
            className={styles.imgWrapperL}
            clicked={showPrev}
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
            clicked={() => showNext(false, true)}
            elementType="normal"
          >
            <img src={goNext} alt="Go Next" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MemoryBoard;
