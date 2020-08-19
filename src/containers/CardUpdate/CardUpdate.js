import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import ReactMarkdown from "react-markdown";
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

/**
 * Check the input valid or not
 * @param {string} value
 * @return {boolean}
 */

const _checkValidity = (value) => {
  let isValid = false;

  isValid = value.trim() !== "";

  return isValid;
};

/**
 * Check the title of the input text
 * @param {string} text
 * @return {sting}
 */
const _showTitle = (text) => {
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
  const [cardForm, changeForm] = useState(initForm);

  const [preview, flipPreview] = useState(false);

  const [addNew, flipAddNew] = useState(true);

  const [frontSide, flipSide] = useState(true);

  const match = useRouteMatch();

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
   * @param {string} frontValue
   * @param {string} backValue
   */

  const _setUpdate = (frontValue, backValue) => {
    changeForm((prevForm) => {
      const updatedOrderForm = {
        ...prevForm.card,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: frontValue,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: backValue,
        valid: true,
      };

      return { card: updatedOrderForm, formIsValid: true };
    });

    flipPreview(true);
    flipSide(true);

    flipAddNew(false);
  };

  /**
   * Clear the hint info when focusing
   * @param {object} event
   * @param {string} iniValue
   * @param {string} inputIdentifier
   */

  const _focusedHandler = (event, iniValue, inputIdentifier) => {
    if (event.target.value === iniValue) {
      changeForm((prevForm) => {
        const updatedOrderForm = {
          ...prevForm.card,
        };
        updatedOrderForm[inputIdentifier] = {
          value: "",
          valid: false,
        };
        return { card: updatedOrderForm, formIsValid: false };
      });
    }
  };

  /**
   * Back to initial when empty and blured
   * @param {object} event
   * @param {string} iniValue
   * @param {string} inputIdentifier
   */

  const _bluredHandler = (event, iniValue, inputIdentifier) => {
    if (event.target.value === "") {
      changeForm((prevForm) => {
        const updatedOrderForm = {
          ...prevForm.card,
        };

        updatedOrderForm[inputIdentifier] = {
          ...updatedOrderForm.front,
          value: iniValue,
          valid: true,
        };

        let updatedFormIsValid = true;
        updatedFormIsValid =
          updatedOrderForm[inputIdentifier].valid && updatedFormIsValid;

        return { card: updatedOrderForm, formIsValid: updatedFormIsValid };
      });
    }
  };

  /**
   * Bind the input data and container state
   * @param {object} event
   * @param {string} inputIdentifier
   */

  const _inputChangedHandler = (event, inputIdentifier) => {
    const { value } = event.target;
    changeForm((prevForm) => {
      const updatedOrderForm = {
        ...prevForm.card,
      };

      updatedOrderForm[inputIdentifier] = {
        ...updatedOrderForm.front,
        value,
        valid: _checkValidity(value),
      };

      let updatedFormIsValid = true;

      updatedFormIsValid =
        updatedOrderForm.front.valid && updatedOrderForm.back.valid;

      return {
        card: updatedOrderForm,
        formIsValid: updatedFormIsValid,
      };
    });
  };

  // Function when add button clicked
  const _cardAddedHandler = () => {
    changeForm((prevForm) => {
      const newCard = {
        id: +new Date(),
        // id: Math.random().toString(36).substr(2),
        title: _showTitle(prevForm.card.front.value) || "Card",
        frontValue: prevForm.card.front.value,
        backValue: prevForm.card.back.value,
      };

      const updatedOrderForm = {
        ...prevForm.card,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: myPlaceHolderF,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: myPlaceHolderB,
        valid: true,
      };

      onAddCard && onAddCard(newCard);

      return {
        card: updatedOrderForm,
        formIsValid: true,
      };
    });
    flipPreview(false);
    flipSide(true);
  };

  // Function when update button clicked
  const _cardUpdatedHandler = () => {
    const newCard = {
      id: activeId,
      title: _showTitle(cardForm.card.front.value) || "Card",
      frontValue: cardForm.card.front.value,
      backValue: cardForm.card.back.value,
    };

    // Use reducer's function
    onUpdateCard && onUpdateCard(newCard);
  };

  /**
   * Function when delete button clicked
   * @param {string} cardId
   */

  const _cardRemoveHandler = (cardId) => {
    // Use reducer's function
    onDeleteCard && onDeleteCard(cardId);
  };

  useEffect(() => {
    // Load card when initial generate page
    const _loadCards = async () => {
      // Get the name from URL
      if (match.params && match.params.name) {
        if (match.params.name !== activeListName) {
          if (Object.keys(cardsCache).includes(match.params.name)) {
            const cardIds = Object.keys(cardsCache[match.params.name]).sort(
              (a, b) => {
                return b - a;
              }
            );
            onInitExist && onInitExist(match.params.name, cardIds, null);
          } else {
            onLoadCards && onLoadCards(match.params.name);
          }
        }
      }
    };

    _loadCards();
  }, [
    match.params,
    match.params.name,
    activeListName,
    onInitExist,
    onLoadCards,
    cardsCache,
  ]);

  // Preview or raw string the markdown preview
  const _preToggled = () => {
    flipPreview((prev) => {
      return !prev;
    });
  };

  // Reset pre holder
  const _addToggled = () => {
    changeForm((prevForm) => {
      const updatedOrderForm = {
        ...prevForm.card,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: myPlaceHolderF,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: myPlaceHolderB,
        valid: true,
      };

      return {
        card: updatedOrderForm,
        formIsValid: true,
      };
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
      changed={(event) => _inputChangedHandler(event, "front")}
      focused={(event) => _focusedHandler(event, myPlaceHolderF, "front")}
      blured={(event) => _bluredHandler(event, myPlaceHolderF, "front")}
    />
  );

  const backForm = (
    <Input
      elementType="textarea"
      id="backInput"
      value={cardForm.card.back.value}
      changed={(event) => _inputChangedHandler(event, "back")}
      focused={(event) => _focusedHandler(event, myPlaceHolderB, "back")}
      blured={(event) => _bluredHandler(event, myPlaceHolderB, "back")}
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
      clicked={_preToggled}
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
      {frontSide ? "BACK" : "FRONT"}
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

  // const deleted={adder ? null : () => this._cardRemoveHandler(activeId)}

  let buttons = (
    <>
      {modeE && sideToggleButton}
      {previewButton}
      <Button
        btnType="Success"
        disabled={!cardForm.formIsValid}
        size="Medium"
        clicked={_cardAddedHandler}
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
            _cardRemoveHandler(activeId);
            onCancelled();
            _addToggled();
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
            _addToggled();
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
            _cardUpdatedHandler();
            // history.goBack();
            _addToggled();
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
        <PadList setUpdate={_setUpdate} />
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
