import { useState, useEffect } from 'react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useImmer } from 'use-immer';
import Tex from '@matejmazur/react-katex';
import math from 'remark-math';
import { useParams } from 'react-router-dom';

import useCards from '@/features/memory-card/use-swr-memory-card';
import useLocalCards from '@/features/memory-card/use-local-memory-card';
import useCardsForPage from '@/features/memory-card/use-memory-card';
import {
  CardsShowWrapper,
  // CardsEditWrapper,
  PadList,
  CodeBlock,
  Editor,
} from '@/features/memory-card/components';
import {
  Drawer,
  Button,
  Toolbar,
  PreviewButton,
  SideToggleButton,
  AiGenButton,
} from '@/features/ui';
import { useCardStore } from '@/store/zustand';
import { DeleteIcon, SaveIcon } from '@/assets/images';

const myPlaceHolderF =
  'Front side/Questions \n\nYou can use "# YourTitleHere" to add a title';
const myPlaceHolderB = 'This is the back side';
const promptHolder = 'Additional information for AI';

const googleGenerativeAiUrl =
  process.env.MODE === 'development'
    ? 'https://google-generative-api.vercel.app/api/generate-content'
    : '/api/generate-content';

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
  prompt: string;
  formIsValid: boolean;
};

/**
 * Check the input valid or not
 */

const checkValidity = (value: string): boolean => {
  let isValid = false;

  isValid = value.trim() !== '';

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

  return '';
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
  prompt: promptHolder,
};

/* eslint-disable*/
const renderers = {
  code: CodeBlock,
  inlineMath: ({ value }: { value: any }) => <Tex math={value} />,
  math: ({ value }: { value: any }) => <Tex block math={value} />,
};
/* eslint-enable */

const CardUpdate: React.FC<{ localDB?: boolean }> = ({ localDB = false }) => {
  const [cardForm, changeForm] = useImmer<UpdateInitState>(initForm);

  const [preview, flipPreview] = useState<boolean>(false);

  const [addNew, flipAddNew] = useState<boolean>(true);

  const [frontSide, flipSide] = useState<boolean>(true);

  const { name: activeListName } = useParams<{ name: string }>();

  const [isGettingAiResult, setIsGettingAiFlag] = useState<boolean>(false);

  const {
    onAddCard: onCloudAddCard,
    onUpdateCard: onCloudUpdateCard,
    onDeleteCard: onCloudDeleteCard,
    onCancelled: onCloudCancelled,
    cardsData: cloudCardsData,
    setCardsData: setCloudCardsData,
  } = useCardsForPage();

  const {
    cardsDataLocal,
    onAddCard: onLocalAddCard,
    onDeleteCard: onLocalDeleteCard,
    onUpdateCard: onLocalUpdateCard,
    onCancelled: onLocalCancelled,
    setCardsDataLocal,
  } = useLocalCards(activeListName || '');

  const cardsData = localDB ? cardsDataLocal : cloudCardsData;

  const { cards } = useCards(activeListName || '');

  const { modeS, drawerVisible, setDrawerVisibility } = useCardStore();

  const { activeId } = cardsData;

  useEffect(() => {
    if (cards) {
      const cardIds = Object.keys(cards).sort(
        (a, b) => parseInt(b, 10) - parseInt(a, 10)
      );
      setCloudCardsData((draft) => {
        draft.cardsCache = cards;
        draft.sortedIds = cardIds;
        // draft.activeListName = activeListName;
      });
    }
  }, [cards, setCloudCardsData]);

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

  const focusedHandler =
    (type: string = 'question') =>
    (
      // event: React.FocusEvent<HTMLTextAreaElement>,
      value: string,
      iniValue: string,
      inputIdentifier: 'front' | 'back'
    ) => {
      if (type === 'prompt') {
        changeForm((draft) => {
          draft.prompt = '';
        });
        return;
      }
      if (value === iniValue) {
        changeForm((draft) => {
          draft.card[inputIdentifier] = {
            value: '',
            valid: false,
          };
          draft.formIsValid = false;
        });
      }
    };

  /**
   * Back to initial when empty and blured
   */

  const bluredHandler =
    (type: string = 'question') =>
    (
      // event: React.FocusEvent<HTMLTextAreaElement>,
      value: string,
      iniValue: string,
      inputIdentifier: 'front' | 'back'
    ) => {
      if (type === 'prompt' && value === '') {
        changeForm((draft) => {
          draft.prompt = promptHolder;
        });
        return;
      }
      if (value === '') {
        changeForm((draft) => {
          draft.card[inputIdentifier] = {
            value: iniValue,
            valid: true,
          };
          draft.formIsValid =
            inputIdentifier === 'front'
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
    inputIdentifier: 'front' | 'back'
  ) => {
    // const { value } = event.target;

    const inputValid = checkValidity(value);

    changeForm((draft) => {
      draft.card[inputIdentifier] = {
        value,
        valid: inputValid,
      };

      draft.formIsValid =
        inputIdentifier === 'front'
          ? inputValid && draft.card.back.valid
          : inputValid && draft.card.front.valid;
    });
  };

  // Prompt input handler
  const promptInputChangedHandler = (
    // event: React.ChangeEvent<HTMLTextAreaElement>,
    value: string
  ) => {
    // const { value } = event.target;

    changeForm((draft) => {
      draft.prompt = value;
    });
  };

  // Function when add button clicked
  const cardAddedHandler = () => {
    const newCard = {
      id: (+new Date()).toString(),
      // id: Math.random().toString(36).substr(2),
      title: showTitle(cardForm.card.front.value) || 'Card',
      frontValue: cardForm.card.front.value,
      backValue: cardForm.card.back.value,
    };

    if (onLocalAddCard && localDB)
      onLocalAddCard(newCard, activeListName || '');
    else if (onCloudAddCard) onCloudAddCard(newCard, activeListName || '');
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

  const generateAnswerHandler = async (questionValue: string) => {
    if (questionValue) {
      setIsGettingAiFlag(true);
      try {
        const res = await fetch(googleGenerativeAiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ prompt: questionValue }),
        });

        if (res.ok) {
          const data = await res.json();
          inputChangedHandlerFromValue(data, 'back');
        } else {
          console.log(res);
        }
        setIsGettingAiFlag(false);
      } catch (error) {
        console.log(error);
        setIsGettingAiFlag(false);
      }
    }
  };

  // Function when update button clicked
  const cardUpdatedHandler = () => {
    if (activeId) {
      const newCard = {
        id: activeId,
        title: showTitle(cardForm.card.front.value) || 'Card',
        frontValue: cardForm.card.front.value,
        backValue: cardForm.card.back.value,
      };

      // Use reducer's function
      if (localDB) {
        onLocalUpdateCard(activeListName || '', newCard);
        return;
      }
      onCloudUpdateCard(activeListName || '', newCard);
    }
  };

  /**
   * Function when delete button clicked
   */
  const cardRemoveHandler = (cardId: string | null) => {
    // Use reducer's function
    if (cardId && localDB) {
      onLocalDeleteCard(activeListName || '', cardId);
      return;
    }
    if (cardId) {
      onCloudDeleteCard(activeListName || '', cardId);
    }
  };

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
    <div className="flex flex-col">
      <Editor
        key="front"
        textValue={cardForm.card.front.value}
        side="front"
        inputChangedHandler={inputChangedHandlerFromValue}
        focusedHandler={focusedHandler()}
        bluredHandler={bluredHandler()}
        myPlaceHolder={myPlaceHolderF}
        stack={true}
        className="editor halfHeight"
      />

      <Editor
        key="prompt"
        textValue={cardForm.prompt}
        side="front"
        inputChangedHandler={promptInputChangedHandler}
        focusedHandler={focusedHandler('prompt')}
        bluredHandler={bluredHandler('prompt')}
        myPlaceHolder={promptHolder}
        stack={true}
        className="editor halfHeight"
      />
    </div>
  );

  const backForm = (
    <Editor
      key="back"
      textValue={cardForm.card.back.value}
      side="back"
      inputChangedHandler={inputChangedHandlerFromValue}
      focusedHandler={focusedHandler()}
      bluredHandler={bluredHandler()}
      myPlaceHolder={myPlaceHolderB}
      className="editor shadow fullHeight"
    />
  );

  const prevValue = (side: 'front' | 'back') => (
    <div
      className={
        modeS
          ? 'padStyles md:w-[682px] cardShow markdownStyle 2xl:h-[650px]'
          : 'padStyles w-[400px] cardShow markdownStyle'
      }
    >
      <ReactMarkdown
        children={cardForm.card[side].value}
        plugins={[math]}
        renderers={renderers}
      />
    </div>
  );

  let cardContentForm;

  if (!preview && !modeS) {
    cardContentForm = (
      <CardsShowWrapper mode={modeS} memBoard={false} preview={preview}>
        <form>
          {frontForm}
          {backForm}
        </form>
      </CardsShowWrapper>
    );
  } else if (!preview && modeS) {
    cardContentForm = (
      <CardsShowWrapper mode={modeS} memBoard={false} preview={preview}>
        <form>{frontSide ? frontForm : backForm}</form>
      </CardsShowWrapper>
    );
  } else if (preview && !modeS) {
    cardContentForm = (
      <CardsShowWrapper mode={modeS} memBoard={false} preview={preview}>
        {prevValue('front')}
        {prevValue('back')}
      </CardsShowWrapper>
    );
  } else {
    cardContentForm = (
      <CardsShowWrapper mode={modeS} memBoard={false} preview={preview}>
        {frontSide ? prevValue('front') : prevValue('back')}
      </CardsShowWrapper>
    );
  }

  let buttons = (
    <>
      {(!frontSide || !modeS) && (
        <AiGenButton
          disabled={false}
          isGettingAiResult={isGettingAiResult}
          onClick={() =>
            generateAnswerHandler(
              `${cardForm.card.front.value}, ${cardForm.prompt}`
            )
          }
        />
      )}
      {modeS && (
        <SideToggleButton
          disabled={false}
          onClick={() => flipSide((prev) => !prev)}
        />
      )}
      <PreviewButton
        formIsValid={!cardForm.formIsValid}
        onClick={preToggled}
        preview={preview}
      />
      <Button
        btnType="Success"
        disabled={!cardForm.formIsValid}
        size="Medium"
        className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
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
        {modeS && (
          <SideToggleButton
            disabled={false}
            onClick={() => flipSide((prev) => !prev)}
          />
        )}
        <PreviewButton
          formIsValid={!cardForm.formIsValid}
          onClick={preToggled}
          preview={preview}
        />
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          debounced
          className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
          clicked={() => {
            cardRemoveHandler(activeId);
            if (localDB) onLocalCancelled();
            else onCloudCancelled();
            addToggled();
          }}
        >
          <DeleteIcon alt="delete card" fill="rgba(9, 132, 113, 0.9)" />
        </Button>
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          disabled={!cardForm.formIsValid || preview}
          debounced
          className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
          clicked={() => {
            if (localDB) onLocalCancelled();
            else onCloudCancelled();
            cardUpdatedHandler();
            addToggled();
          }}
        >
          <SaveIcon alt="save the change" fill="rgba(9, 132, 113, 0.9)" />
        </Button>
      </>
    );
  }

  return (
    <div className="flex h-full">
      <Drawer
        isOpen={drawerVisible}
        onClose={() => {
          setDrawerVisibility(false);
        }}
      >
        <div className="flex h-full flex-col flex-[0_0_270px] z-[2]">
          <Toolbar />
          <PadList
            setUpdate={setUpdate}
            addToggled={addToggled}
            cardsData={cardsData}
            setCardsData={localDB ? setCardsDataLocal : setCloudCardsData}
            onCancelled={localDB ? onLocalCancelled : onCloudCancelled}
          />
        </div>
      </Drawer>
      <div className="flex items-center justify-center w-full h-full">
        <div className={modeS ? 'padShowWrapperSingle' : 'padShowWrapper'}>
          {cardContentForm}
          <div className="flex justify-end mr-2 flex-wrap">{buttons}</div>
        </div>
      </div>
    </div>
  );
};

export default CardUpdate;
