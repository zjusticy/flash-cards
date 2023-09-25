import { useState, useEffect } from "react";
import * as React from "react";
// import {Link} from 'react-router-dom';
import { useImmer } from "use-immer";

import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Tex from "@matejmazur/react-katex";
import math from "remark-math";
import goPre from "assets/images/leftArrow.png";
import goNext from "assets/images/rightArrow.png";
import useCards from "features/memory-card/use-swr-memory-card";
import useCardsForPage from "features/memory-card/use-memory-card";

import { Button } from "features/ui";
import { CardsShowWrapper, CodeBlock } from "features/memory-card/components";
import styles from "./style/memory-board.module.scss";

import type { MemStateType } from "../../types";

// import lock from '../../assets/images/locker.png';

import { useGlobalContext } from "../../store/store";

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
  emptyList: false,
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

  const { modeS } = useGlobalContext();

  const navigate = useNavigate();

  const { name } = useParams<{ name: string }>();

  const { isLoading, cards } = useCards(name || "");

  const { cardsData, setCardsData } = useCardsForPage();

  const { cardsCache } = cardsData;

  useEffect(() => {
    if (cards) {
      // const cardIds = Object.keys(cards).sort(
      //   (a, b) => parseInt(b, 10) - parseInt(a, 10)
      // );
      setCardsData((draft) => {
        draft.cardsCache = cards;
        // draft.sortedIds = cardIds;
        // draft.activeListName = activeListName;
      });
    }
  }, [cards, setCardsData]);

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

        localStorage.setItem(
          `memoryBoard${listName}`,
          JSON.stringify(updateBoard)
        );

        changeMemState((draft) => {
          draft.memName = listName;
          draft.memIndex = 0;
          [draft.memId] = cardIds;
          draft.activeList = cardIds;
        });
      } else {
        changeMemState((draft) => {
          draft.memIndex = 0;
          draft.emptyList = true;
        });
      }
    };

    if (name) {
      // Load the last record of memory board
      const myBoardJ = localStorage.getItem(`memoryBoard${name}`);
      // If myBoard exist
      if (myBoardJ) {
        const myBoard: MemStore = JSON.parse(myBoardJ);

        const activeIndex = myBoard.listA.indexOf(myBoard.activeId);

        changeMemState((draft) => {
          draft.memName = myBoard.listName;
          draft.memIndex = activeIndex;
          draft.memId = myBoard.activeId;
          draft.activeList = myBoard.listA;
          draft.backUpList = myBoard.listB;
        });
        // setLoadedState(true);
      }
      // myBoard not exist, initialize it

      // If cards is not in cache, fetch them
      else if (
        cardsCache &&
        !isLoading &&
        !Object.keys(cardsCache).includes(name)
      ) {
        setCards(Object.keys(cardsCache), name);
      }
    }
    // if (!loaded) {
    //   loadCards();
    // }
  }, [name, changeMemState, cardsCache, isLoading]);

  /**
   * Move to the next card
   * @param {boolean} easy
   * @param {boolean} arrow
   * @return {none}
   */
  const showNext = (easy: boolean, arrow: boolean) => {
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
      changeMemState((prevState) => ({ ...prevState, done: true }));
    }
  };

  // Show previous card
  const showPrev = () => {
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
    navigate("/");
  };

  const objExi =
    memState.memId && cardsCache && Object.hasOwn(cardsCache, memState.memId);

  // if (cardsCache && memState.memId) {
  //   console.log(Object.hasOwn(cardsCache, memState.memId), "hehe");
  // }

  const frontPad =
    (memState.memId && objExi && cardsCache[memState.memId].frontValue) || "";

  const backPad =
    (memState.memId && objExi && cardsCache[memState.memId].backValue) || "";

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
    if (memState.emptyList) {
      donePage = (
        <div className={styles.cardShowSingle}>
          <p className={styles.doneText}>EMPTY LIST !</p>
        </div>
      );
    } else if (memState.done) {
      donePage = (
        <div className={styles.cardShowSingle}>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
          <p className={styles.doneText}>CLEAR !</p>
        </div>
      );
    } else {
      donePage = (
        <div className={`${styles.cardShowSingle} ${styles.markdownStyle}`}>
          <ReactMarkdown
            source={side ? frontPad : backPad}
            plugins={[math]}
            renderers={renderers}
          />
        </div>
      );
    }
  }

  const buttons =
    memState.done || memState.emptyList ? (
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
    <div className={styles.app}>
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
            <CardsShowWrapper memBoard mode={modeS} preview={false}>
              {donePage}
            </CardsShowWrapper>
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
    </div>
  );
};

export default MemoryBoard;