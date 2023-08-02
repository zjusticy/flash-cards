import { useState, useEffect } from "react";
import * as React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useImmer } from "use-immer";
import Tex from "@matejmazur/react-katex";
import math from "remark-math";
import styles from "./style/CardUpdate.module.scss";

import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
// import Layout from "../../hoc/Layout/Layout.tsx.bak";
import PadList from "./components/PadList/PadList";
import Drawer from "../../components/Drawer/Drawer";
import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import useCards from "./hooks/useCards";
// import useWindowSize from "../../hooks/useWindowSize";

import { useGlobalContext } from "../../store/store";
import CodeBlock from "../../components/CodeBlock/codeBlock";
import Editor from "../../components/Editor/Editor";

const myPlaceHolderF =
  'This is the front side \n\nUse "#" and a blank space at the beginning before the actual title';
const myPlaceHolderB = "This is the back side";

type UpdateInitState = {
  card: {
    front: {
      value: string;
      valid: boolean;
    };
    back: {
      value: string;
      valid: boolean;
    };
  };
  formIsValid: boolean;
};

/**
 * Check the input valid or not
 */

const checkValidity = (value: string): boolean => {
  let isValid = false;

  isValid = value.trim() !== "";

  return isValid;
};

/**
 * Check the title of the input text
 */
const showTitle = (text: string): string => {
  const filter = /^#\s(.*)\n?/g;
  const result = filter.exec(text);

  if (result) {
    return result[1];
  }

  return "";
};

const initForm = {
  card: {
    front: {
      value: myPlaceHolderF,
      valid: true,
    },
    back: {
      value: myPlaceHolderB,
      valid: true,
    },
  },
  formIsValid: true,
};

/* eslint-disable*/
const renderers = {
  code: CodeBlock,
  inlineMath: ({ value }: { value: any }) => <Tex math={value} />,
  math: ({ value }: { value: any }) => <Tex block math={value} />,
};
/* eslint-enable */

const CardUpdate = () => {
  const [cardForm, changeForm] = useImmer<UpdateInitState>(initForm);

  const [preview, flipPreview] = useState<boolean>(false);

  const [addNew, flipAddNew] = useState<boolean>(true);

  const [frontSide, flipSide] = useState<boolean>(true);

  // const { withinSize } = useWindowSize(768);

  const { name } = useParams<{ name: string }>();

  const {
    // cardsCache,
    // activeListName,
    // activeId,
    // modeE,
    onInitExist,
    onAddCard,
    onDeleteCard,
    onUpdateCard,
    onCancelled,
    onLoadCards,
  } = useCards();

  const { cardsData, modeE, drawerVisible, setDrawerVisibility } =
    useGlobalContext();

  const { activeId, activeListName, cardsCache } = cardsData;

  /**
   * Set new initial value
   */

  const setUpdate = (frontValue: string, backValue: string) => {
    changeForm((draft) => {
      draft.card.front.value = frontValue;
      draft.card.front.valid = true;

      draft.card.back.value = backValue;
      draft.card.back.valid = true;

      draft.formIsValid = true;
    });

    flipPreview(true);
    flipSide(true);
    flipAddNew(false);
  };

  /**
   * Clear the hint info when focusing
   */

  const focusedHandler = (
    // event: React.FocusEvent<HTMLTextAreaElement>,
    value: string,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => {
    if (value === iniValue) {
      changeForm((draft) => {
        draft.card[inputIdentifier] = {
          value: "",
          valid: false,
        };
        draft.formIsValid = false;
      });
    }
  };

  /**
   * Back to initial when empty and blured
   */

  const bluredHandler = (
    // event: React.FocusEvent<HTMLTextAreaElement>,
    value: string,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => {
    if (value === "") {
      changeForm((draft) => {
        draft.card[inputIdentifier] = {
          value: iniValue,
          valid: true,
        };
        draft.formIsValid =
          inputIdentifier === "front"
            ? draft.card.back.valid
            : draft.card.front.valid;
      });
    }
  };

  /**
   * Common input data update
   */
  const inputChangedHandlerFromValue = (
    // event: React.ChangeEvent<HTMLTextAreaElement>,
    value: string,
    inputIdentifier: "front" | "back"
  ) => {
    // const { value } = event.target;

    const inputValid = checkValidity(value);

    changeForm((draft) => {
      draft.card[inputIdentifier] = {
        value,
        valid: inputValid,
      };

      draft.formIsValid =
        inputIdentifier === "front"
          ? inputValid && draft.card.back.valid
          : inputValid && draft.card.front.valid;
    });
  };

  /**
   * Common Change handler
   */
  // const inputChangedHandlerFromEvents = useCallback(
  //   (
  //     event: React.ChangeEvent<HTMLTextAreaElement>,
  //     inputIdentifier: "front" | "back"
  //   ) => {
  //     const { value } = event.target;

  //     valueUpdater(value, inputIdentifier);
  //   },
  //   [valueUpdater]
  // );

  // const inputChangedHandlerFromValue = (
  //   value: string,
  //   inputIdentifier: "front" | "back"
  // ) => {
  //   // const { value } = event.target;

  //   valueUpdater(value, inputIdentifier);
  // };

  // Function when add button clicked
  const cardAddedHandler = () => {
    const newCard = {
      id: (+new Date()).toString(),
      // id: Math.random().toString(36).substr(2),
      title: showTitle(cardForm.card.front.value) || "Card",
      frontValue: cardForm.card.front.value,
      backValue: cardForm.card.back.value,
    };

    if (onAddCard) onAddCard(newCard);

    changeForm((draft) => {
      draft.card.front = {
        value: myPlaceHolderF,
        valid: true,
      };

      draft.card.back = {
        value: myPlaceHolderB,
        valid: true,
      };

      draft.formIsValid = true;
    });

    flipPreview(false);
    flipSide(true);
  };

  // Function when update button clicked
  const cardUpdatedHandler = () => {
    if (activeId) {
      const newCard = {
        id: activeId,
        title: showTitle(cardForm.card.front.value) || "Card",
        frontValue: cardForm.card.front.value,
        backValue: cardForm.card.back.value,
      };

      // Use reducer's function
      onUpdateCard(activeListName, newCard);
    }
  };

  /**
   * Function when delete button clicked
   */

  const cardRemoveHandler = (cardId: string | null) => {
    // Use reducer's function
    if (cardId) onDeleteCard(activeListName, cardId);
  };

  useEffect(() => {
    // Load card when initial generate page
    const loadCards = async () => {
      // Get the name from URL
      if (name) {
        if (name !== activeListName) {
          if (Object.keys(cardsCache).includes(name)) {
            const cardIds = Object.keys(cardsCache[name]).sort(
              (a, b) => parseInt(b, 10) - parseInt(a, 10)
            );
            onInitExist(name, cardIds, null);

            // setActiveListName(name);
            // setSortedIds(cardIds);
            // setActiveId(null);
          } else {
            onLoadCards(name);
          }
        }
      }
    };

    loadCards();
  }, [name, activeListName, onInitExist, cardsCache, onLoadCards]);

  // Preview or raw string the markdown preview
  const preToggled = () => {
    flipPreview((prev) => !prev);
  };

  useEffect(() => {
    setDrawerVisibility(true);
  }, [setDrawerVisibility]);

  // Reset pre holder
  const addToggled = () => {
    changeForm((draft) => {
      draft.card.front = {
        value: myPlaceHolderF,
        valid: true,
      };

      draft.card.back = {
        value: myPlaceHolderB,
        valid: true,
      };

      draft.formIsValid = true;
    });
    flipPreview(false);
    flipAddNew(true);
    flipSide(true);
  };

  const frontForm = (
    <Editor
      key="front"
      textValue={cardForm.card.front.value}
      side="front"
      inputChangedHandler={inputChangedHandlerFromValue}
      // inputChangedHandler={inputChangedHandlerFromEvents}
      // id="frontInput"
      focusedHandler={focusedHandler}
      bluredHandler={bluredHandler}
      myPlaceHolder={myPlaceHolderF}
      className={styles.Editor}
    />
  );

  const backForm = (
    <Editor
      key="back"
      textValue={cardForm.card.back.value}
      side="back"
      inputChangedHandler={inputChangedHandlerFromValue}
      // inputChangedHandler={inputChangedHandlerFromEvents}
      // id="backInput"
      focusedHandler={focusedHandler}
      bluredHandler={bluredHandler}
      myPlaceHolder={myPlaceHolderB}
      className={styles.Editor}
    />
    // <CodeMirror
    //   value={cardForm.card.back.value}
    //   options={DEFAULT_MARKDOWN_OPTIONS}
    //   onBeforeChange={(editor, data, value) => {
    //     inputChangedHandler(value, "back");
    //   }}
    // />
    // <Input
    //   elementType="textarea"
    //   id="backInput"
    //   value={cardForm.card.back.value}
    //   tChanged={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
    //     inputChangedHandler(event, "back")
    //   }
    //   focused={(event: React.FocusEvent<HTMLTextAreaElement>) =>
    //     focusedHandler(event, myPlaceHolderB, "back")
    //   }
    //   blured={(event: React.FocusEvent<HTMLTextAreaElement>) =>
    //     bluredHandler(event, myPlaceHolderB, "back")
    //   }
    // />
  );

  const prevValue = (side: "front" | "back") => (
    <div className={styles.cardCenter}>
      <div
        className={`${modeE ? styles.cardShowSingle : styles.cardShowDouble} ${
          styles.markdownStyle
        }`}
      >
        <ReactMarkdown
          source={cardForm.card[side].value}
          plugins={[math]}
          renderers={renderers}
        />
      </div>
    </div>
  );

  // const backPrev = (
  //   <div
  //     className={`${modeE ? styles.cardShowSingle : styles.cardShowDouble} ${
  //       styles.markdownStyle
  //     }`}
  //   >
  //     <ReactMarkdown
  //       source={cardForm.card.back.value}
  //       renderers={{ code: CodeBlock }}
  //     />
  //   </div>
  // );

  const previewButton = (
    <Button
      btnType="Success"
      disabled={!cardForm.formIsValid}
      size="Medium"
      clicked={preToggled}
      elementType="normal"
    >
      {preview ? "EDIT" : "PREVIEW"}
    </Button>
  );

  const sideToggleButton = (
    <Button
      btnType="Success"
      disabled={false}
      size="Medium"
      clicked={() => flipSide((prev) => !prev)}
      elementType="normal"
    >
      FLIP
    </Button>
  );

  let form;

  if (!preview && !modeE) {
    form = (
      <form>
        {frontForm}
        {backForm}
      </form>
    );
  } else if (!preview && modeE) {
    form = (
      <div className={styles.cardCenter}>
        <form>{frontSide ? frontForm : backForm}</form>
      </div>
    );
  } else if (preview && !modeE) {
    form = (
      <>
        {prevValue("front")}
        {prevValue("back")}
      </>
    );
  } else {
    form = frontSide ? prevValue("front") : prevValue("back");
  }

  let buttons = (
    <>
      {modeE && sideToggleButton}
      {previewButton}
      <Button
        btnType="Success"
        disabled={!cardForm.formIsValid}
        size="Medium"
        debounced
        clicked={cardAddedHandler}
        elementType="normal"
      >
        ADD
      </Button>
    </>
  );

  if (!addNew) {
    buttons = (
      <>
        {modeE && sideToggleButton}
        {previewButton}
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          debounced
          clicked={() => {
            cardRemoveHandler(activeId);
            onCancelled();
            addToggled();
            // history.goBack();
          }}
        >
          DELETE
        </Button>
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          disabled={!cardForm.formIsValid || preview}
          debounced
          clicked={() => {
            onCancelled();
            cardUpdatedHandler();
            // history.goBack();
            addToggled();
          }}
        >
          UPDATE
        </Button>
      </>
    );
  }

  return (
    <div className={styles.app}>
      <Drawer
        isOpen={drawerVisible}
        onClose={() => {
          setDrawerVisibility(false);
        }}
      >
        <div className={styles.sideBar}>
          <Toolbar />
          <PadList setUpdate={setUpdate} addToggled={addToggled} />
        </div>
      </Drawer>
      <div className={styles.memShowWrapper}>
        <div
          className={
            modeE ? styles.padShowWrapperSingle : styles.padShowWrapper
          }
        >
          <CardsWrapper mode={modeE} memBoard={false} preview={preview}>
            {form}
          </CardsWrapper>
          <div className={styles.btnWrapper}>{buttons}</div>
        </div>
      </div>
    </div>
  );
};

export default CardUpdate;
