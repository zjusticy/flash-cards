import { useState, useEffect } from 'react';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import Tex from '@matejmazur/react-katex';
import math from 'remark-math';
import { useParams } from 'react-router-dom';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import useWindowSize from '@/utils/useWindowSize';
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

/* eslint-disable*/
const renderers = {
  code: CodeBlock,
  inlineMath: ({ value }: { value: any }) => <Tex math={value} />,
  math: ({ value }: { value: any }) => <Tex block math={value} />,
};
/* eslint-enable */

const CardUpdate: React.FC<{ localDB?: boolean }> = ({ localDB = false }) => {
  // const [cardForm, changeForm] = useImmer<UpdateInitState>(initForm);

  const [frontValue, changeFrontValue] = useState<string>('');
  const [backValue, changeBackValue] = useState<string>('');
  const [promptValue, changePromptValue] = useState<string>('');

  const [preview, flipPreview] = useState<boolean>(false);

  const [addNew, flipAddNew] = useState<boolean>(true);

  const [frontSide, flipSide] = useState<boolean>(true);

  const { name: activeListName } = useParams<{ name: string }>();

  const [isGettingAiResult, setIsGettingAiFlag] = useState<boolean>(false);

  const windowSize = useWindowSize();

  const withinSize = windowSize?.width && windowSize?.width < 1120;

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

  const { drawerVisible, setDrawerVisibility } = useCardStore();

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

  const setUpdate = (frontValue: string, backValue: string, prompt: string) => {
    changeFrontValue(frontValue);
    changeBackValue(backValue);
    changePromptValue(prompt);

    flipPreview(true);
    flipSide(true);
    flipAddNew(false);
  };

  // Function when add button clicked
  const cardAddedHandler = () => {
    const newCard = {
      id: (+new Date()).toString(),
      title: showTitle(frontValue) || 'Card',
      frontValue,
      backValue,
      prompt: promptValue,
    };

    if (onLocalAddCard && localDB)
      onLocalAddCard(newCard, activeListName || '');
    else if (onCloudAddCard) onCloudAddCard(newCard, activeListName || '');

    changeFrontValue('');
    changeBackValue('');
    changePromptValue('');

    flipPreview(false);
    flipSide(true);
  };

  const generateAnswerHandler = async (questionValue: string) => {
    if (questionValue) {
      setIsGettingAiFlag(true);

      changeBackValue('');
      try {
        await fetchEventSource(googleGenerativeAiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: questionValue }),
          async onopen(response) {
            if (
              response.ok &&
              response.headers.get('Content-Type') === 'text/event-stream'
            ) {
              return; // Everything's good
            } else if (
              response.status >= 400 &&
              response.status < 500 &&
              response.status !== 429
            ) {
              throw new Error(`Server error: ${response.status}`);
            }
          },
          onmessage(event) {
            const data = JSON.parse(event.data);
            if (data.text) {
              changeBackValue((prev) => prev + data.text);
            }
          },
          onclose() {
            setIsGettingAiFlag(false);
            console.log('Connection closed');
          },
          onerror(err) {
            console.error(err);
            setIsGettingAiFlag(false);
          },
        });
      } catch (err) {
        console.error('Failed to fetch:', err);
        setIsGettingAiFlag(false);
      }
    }
  };

  // Function when update button clicked
  const cardUpdatedHandler = () => {
    if (activeId) {
      const newCard = {
        id: activeId,
        title: showTitle(frontValue) || 'Card',
        frontValue,
        backValue,
        prompt: promptValue,
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
  const cardRemoveHandler = ({
    activeListName,
    cardId,
  }: {
    activeListName: string | undefined;
    cardId: string | null;
  }) => {
    // Use reducer's function
    if (cardId && localDB) {
      onLocalDeleteCard(activeListName || '', cardId);
      return;
    }
    console.log(activeListName);
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
    // changeForm((draft) => {
    //   draft.card.front = {
    //     value: myPlaceHolderF,
    //     valid: true,
    //   };

    //   draft.card.back = {
    //     value: myPlaceHolderB,
    //     valid: true,
    //   };

    //   draft.formIsValid = true;
    // });
    changeFrontValue('');
    changeBackValue('');
    changePromptValue('');

    flipPreview(false);
    flipAddNew(true);
    flipSide(true);
  };

  const frontForm = (
    <div className="flex flex-col">
      <Editor
        key="front"
        textValue={frontValue}
        side="front"
        inputChangedHandler={changeFrontValue}
        myPlaceHolder={myPlaceHolderF}
        stack={true}
        className="editor halfHeight"
      />

      <Editor
        key="prompt"
        textValue={promptValue}
        side="front"
        inputChangedHandler={changePromptValue}
        myPlaceHolder={promptHolder}
        stack={true}
        className="editor halfHeight"
      />
    </div>
  );

  const backForm = (
    <Editor
      key="back"
      // textValue={cardForm.card.back.value}
      textValue={backValue}
      side="back"
      inputChangedHandler={changeBackValue}
      myPlaceHolder={myPlaceHolderB}
      className="editor shadow fullHeight"
    />
  );

  const prevValue = (side: 'front' | 'back') => (
    <div
      className={
        withinSize
          ? 'padStyles md:w-[682px] cardShow markdownStyle 2xl:h-[650px] h-[500px]'
          : 'padStyles w-[400px] cardShow markdownStyle'
      }
    >
      <ReactMarkdown
        children={side === 'front' ? frontValue : backValue}
        plugins={[math]}
        renderers={renderers}
      />
    </div>
  );

  let cardContentForm;

  if (!preview && !withinSize) {
    cardContentForm = (
      <CardsShowWrapper
        mode={withinSize || false}
        memBoard={false}
        preview={preview}
      >
        <form>
          {frontForm}
          {backForm}
        </form>
      </CardsShowWrapper>
    );
  } else if (!preview && withinSize) {
    cardContentForm = (
      <CardsShowWrapper
        mode={withinSize || false}
        memBoard={false}
        preview={preview}
      >
        <form>{frontSide ? frontForm : backForm}</form>
      </CardsShowWrapper>
    );
  } else if (preview && !withinSize) {
    cardContentForm = (
      <CardsShowWrapper
        mode={withinSize || false}
        memBoard={false}
        preview={preview}
      >
        {prevValue('front')}
        {prevValue('back')}
      </CardsShowWrapper>
    );
  } else {
    cardContentForm = (
      <CardsShowWrapper
        mode={withinSize || false}
        memBoard={false}
        preview={preview}
      >
        {frontSide ? prevValue('front') : prevValue('back')}
      </CardsShowWrapper>
    );
  }

  let buttons = (
    <>
      {(!frontSide || !withinSize) && (
        <AiGenButton
          disabled={false}
          isGettingAiResult={isGettingAiResult}
          onClick={() => generateAnswerHandler(`${frontValue}, ${promptValue}`)}
        />
      )}
      {withinSize && (
        <SideToggleButton
          disabled={false}
          onClick={() => flipSide((prev) => !prev)}
        />
      )}
      <PreviewButton onClick={preToggled} preview={preview} />
      <Button
        btnType="Success"
        disabled={!(checkValidity(frontValue) && checkValidity(backValue))}
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
        {withinSize && (
          <SideToggleButton
            disabled={false}
            onClick={() => flipSide((prev) => !prev)}
          />
        )}
        <PreviewButton onClick={preToggled} preview={preview} />
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          debounced
          className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
          clicked={() => {
            cardRemoveHandler({ activeListName, cardId: activeId });
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
          disabled={
            !(checkValidity(frontValue) && checkValidity(backValue)) || preview
          }
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
        <div className={withinSize ? 'padShowWrapperSingle' : 'padShowWrapper'}>
          {cardContentForm}
          <div className="flex justify-end mr-2 flex-wrap">{buttons}</div>
        </div>
      </div>
    </div>
  );
};

export default CardUpdate;
