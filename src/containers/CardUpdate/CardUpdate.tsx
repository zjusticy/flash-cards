import { useState, useEffect } from "react";
import * as React from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useImmer } from "use-immer";
import styles from "./CardUpdate.module.scss";

// import CardsWrapper from '../../hoc/CardsWrapper/CardsWrapper';
import Input from "../../components/UI/Input/Input";

import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
import Layout from "../../hoc/Layout/Layout";
import PadList from "../../components/PadList/PadList";
import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

import useCards from "../../hooks/useCards";
import CodeBlock from "../../components/CodeBlock/codeBlock";

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

const CardUpdate = () => {
  const [cardForm, changeForm] = useImmer<UpdateInitState>(initForm);

  const [preview, flipPreview] = useState<boolean>(false);

  const [addNew, flipAddNew] = useState<boolean>(true);

  const [frontSide, flipSide] = useState<boolean>(true);

  const { name } = useParams<{ name: string }>();

  const {
    cardsCache,
    activeListName,
    activeId,
    modeE,
    onInitExist,
    onAddCard,
    onDeleteCard,
    onLoadCards,
    onUpdateCard,
    onCancelled,
  } = useCards();

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
    event: React.FocusEvent<HTMLTextAreaElement>,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => {
    if (event.target.value === iniValue) {
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
    event: React.FocusEvent<HTMLTextAreaElement>,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => {
    if (event.target.value === "") {
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
   * Bind the input data and container state
   */

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    inputIdentifier: "front" | "back"
  ) => {
    const { value } = event.target;

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
    const newCard = {
      id: activeId,
      title: showTitle(cardForm.card.front.value) || "Card",
      frontValue: cardForm.card.front.value,
      backValue: cardForm.card.back.value,
    };

    // Use reducer's function
    if (activeId && onUpdateCard) onUpdateCard(newCard);
  };

  /**
   * Function when delete button clicked
   */

  const cardRemoveHandler = (cardId: string | null) => {
    // Use reducer's function
    if (cardId && onDeleteCard) onDeleteCard(cardId);
  };

  useEffect(() => {
    // Load card when initial generate page
    const loadCards = async () => {
      // Get the name from URL
      if (name) {
        if (name !== activeListName) {
          if (Object.keys(cardsCache).includes(name)) {
            const cardIds = Object.keys(cardsCache[name]).sort((a, b) => {
              return parseInt(b, 10) - parseInt(a, 10);
            });
            if (onInitExist) onInitExist(name, cardIds, null);
          } else if (onLoadCards) onLoadCards(name);
        }
      }
    };

    loadCards();
  }, [name, activeListName, onInitExist, onLoadCards, cardsCache]);

  // Preview or raw string the markdown preview
  const preToggled = () => {
    flipPreview((prev) => {
      return !prev;
    });
  };

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
    flipAddNew((prev) => !prev);
    flipSide(true);
  };

  const frontForm = (
    <Input
      elementType="textarea"
      id="frontInput"
      value={cardForm.card.front.value}
      tChanged={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
        inputChangedHandler(event, "front")
      }
      focused={(event: React.FocusEvent<HTMLTextAreaElement>) =>
        focusedHandler(event, myPlaceHolderF, "front")
      }
      blured={(event: React.FocusEvent<HTMLTextAreaElement>) =>
        bluredHandler(event, myPlaceHolderF, "front")
      }
    />
  );

  const backForm = (
    <Input
      elementType="textarea"
      id="backInput"
      value={cardForm.card.back.value}
      tChanged={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
        inputChangedHandler(event, "back")
      }
      focused={(event: React.FocusEvent<HTMLTextAreaElement>) =>
        focusedHandler(event, myPlaceHolderB, "back")
      }
      blured={(event: React.FocusEvent<HTMLTextAreaElement>) =>
        bluredHandler(event, myPlaceHolderB, "back")
      }
    />
  );

  const frontPrev = (
    <div
      className={`${modeE ? styles.cardShowSingle : styles.cardShowDouble} ${
        styles.markdownStyle
      }`}
    >
      <ReactMarkdown
        source={cardForm.card.front.value}
        renderers={{ code: CodeBlock }}
      />
    </div>
  );

  const backPrev = (
    <div
      className={`${modeE ? styles.cardShowSingle : styles.cardShowDouble} ${
        styles.markdownStyle
      }`}
    >
      <ReactMarkdown
        source={cardForm.card.back.value}
        renderers={{ code: CodeBlock }}
      />
    </div>
  );

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
    form = <form>{frontSide ? frontForm : backForm}</form>;
  } else if (preview && !modeE) {
    form = (
      <>
        {frontPrev}
        {backPrev}
      </>
    );
  } else {
    form = frontSide ? frontPrev : backPrev;
  }

  let buttons = (
    <>
      {modeE && sideToggleButton}
      {previewButton}
      <Button
        btnType="Success"
        disabled={!cardForm.formIsValid}
        size="Medium"
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
          clicked={() => {
            onCancelled();
            // history.goBack();
            addToggled();
          }}
        >
          CANCEL
        </Button>
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          disabled={!cardForm.formIsValid}
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
      <div className={styles.sideBar}>
        <Toolbar />
        <PadList setUpdate={setUpdate} />
      </div>
      <Layout home={false}>
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
      </Layout>
    </div>
  );
};

export default CardUpdate;
