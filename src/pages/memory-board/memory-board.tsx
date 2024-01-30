import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import ReactMarkdown from "react-markdown";
import Tex from "@matejmazur/react-katex";
import math from "remark-math";
import { useParams, useNavigate } from "react-router-dom";

import useCards from "@/features/memory-card/use-swr-memory-card";
import useLocalCards from "@/features/memory-card/use-local-memory-card";
import useCardsForPage from "@/features/memory-card/use-memory-card";
import { Button } from "@/features/ui";
import { CardsShowWrapper, CodeBlock } from "@/features/memory-card/components";
import type { MemStateType } from "@/types";
import { useCardStore } from "@/store/zustand";

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

const MemoryBoard: React.FC<{
  localDB?: boolean;
}> = ({ localDB = false }) => {
  const [memState, changeMemState] = useImmer<MemStateType>(memInit);

  const [side, flipSide] = useState<boolean>(true);

  const { modeS } = useCardStore();

  const navigate = useNavigate();

  const { name: activeListName } = useParams<{ name: string }>();

  const { isLoading: isServerLoading, cards } = useCards(activeListName || "");

  const { isLoading: isLocalLoading, cardsDataLocal } = useLocalCards(
    activeListName || ""
  );

  const isLoading = localDB ? isLocalLoading : isServerLoading;

  const { cardsData, setCardsData } = useCardsForPage();

  const { cardsCache } = localDB ? cardsDataLocal : cardsData;

  useEffect(() => {
    if (cards && !localDB) {
      setCardsData((draft) => {
        draft.cardsCache = cards;
      });
    }
  }, [cards, setCardsData, localDB]);

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

    if (activeListName) {
      // Load the last record of memory board
      const myBoardJ = localStorage.getItem(`memoryBoard${activeListName}`);
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
      }
      // myBoard not exist, initialize it

      // If cards is not in cache, fetch them
      else if (
        cardsCache &&
        !isLoading &&
        !Object.keys(cardsCache).includes(activeListName)
      ) {
        setCards(Object.keys(cardsCache), activeListName);
      }
    }
  }, [activeListName, changeMemState, cardsCache, isLoading]);

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
      localStorage.removeItem(`memoryBoard${activeListName}`);
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
    if (localDB) {
      navigate("/local/intro");
      return;
    }
    navigate("/");
  };

  const objExi =
    memState.memId && cardsCache && Object.hasOwn(cardsCache, memState.memId);

  const frontPad =
    (memState.memId && objExi && cardsCache[memState.memId].frontValue) || "";

  const backPad =
    (memState.memId && objExi && cardsCache[memState.memId].backValue) || "";

  let donePage = memState.done ? (
    <>
      <div className="padStyles w-[400px] cardShow" />
      <div className="padStyles w-[400px] cardShow">
        <p className="text-[42px] font-bold text-right">CLEAR !</p>
        <p className="text-[42px] font-bold text-right">CLEAR !</p>
        <p className="text-[42px] font-bold text-right">CLEAR !</p>
      </div>
    </>
  ) : (
    <>
      <div className="padStyles w-[400px] cardShow markdownStyle">
        <ReactMarkdown
          source={frontPad}
          plugins={[math]}
          renderers={renderers}
        />
      </div>
      <div
        className={
          side
            ? "padStyles w-[400px] cardShow bg-[url('/images/lock_100.png')]"
            : "padStyles w-[400px] cardShow markdownStyle"
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
        <div className="padStyles md:w-[682px] cardShow 2xl:h-[650px]">
          <p className="text-[42px] font-bold text-right">EMPTY LIST !</p>
        </div>
      );
    } else if (memState.done) {
      donePage = (
        <div className="padStyles md:w-[682px] cardShow 2xl:h-[650px]">
          <p className="text-[42px] font-bold text-right">CLEAR !</p>
          <p className="text-[42px] font-bold text-right">CLEAR !</p>
          <p className="text-[42px] font-bold text-right">CLEAR !</p>
        </div>
      );
    } else {
      donePage = (
        <div className="padStyles md:w-[682px] cardShow 2xl:h-[650px] markdownStyle">
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
        className="m-4 w-24"
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
          className="m-4 w-24"
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
          className="m-4 w-24"
          elementType="normal"
        >
          {side ? "SHOW" : "HIDE"}
        </Button>
      </>
    );

  return (
    <div className="h-full">
      <div className="h-full flex items-center justify-center max-[681px]:w-full">
        <div className="max-[681px]:w-full md:items-center md:flex md:justify-center">
          <Button
            className="mb-[5%] mr-8 p-6 hover:bg-gray-200 max-[681px]:fixed max-[681px]:top-[40%] max-[681px]:opacity-70 \
            max-[681px]:mr-0"
            clicked={showPrev}
            elementType="normal"
          >
            <img
              src="/images/leftArrow.png"
              alt="Go Previous"
              className="max-[681px]:h-[32px] max-[681px]:w-[32px]"
            />
          </Button>
          <div
            className="flex flex-col [&_form]:flex [&_form]:justify-between 
          [&_label]:hidden [&_textarea]:padStyle [&_textarea]:w-[400px] [&_textarea]:mr-3"
          >
            <CardsShowWrapper memBoard mode={modeS} preview={false}>
              {donePage}
            </CardsShowWrapper>
            <div className="flex justify-end md:mr-2">{buttons}</div>
          </div>
          <Button
            className="mb-[5%] p-6 ml-8 hover:bg-gray-200 max-[681px]:fixed \
             max-[681px]:top-[40%] max-[681px]:opacity-70 max-[681px]:right-0 max-[681px]:ml-0"
            clicked={() => showNext(false, true)}
            elementType="normal"
          >
            <img
              src="/images/rightArrow.png"
              alt="Go Next"
              className="max-[681px]:h-[32px] max-[681px]:w-[32px]"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryBoard;
