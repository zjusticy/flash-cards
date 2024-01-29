import { FunctionComponent } from "react";
import Button from "@/features/ui/button/button";
import { CardType } from "@/features/memory-card/types-memory-card";
import Card from "@/features/memory-card/components/list-card/list-card";
import { useCardStore } from "@/store/zustand";
import { CardsDataType } from "@/types";
import { WritableDraft } from "immer/dist/types/types-external";

const PadList: FunctionComponent<{
  setUpdate: (front: string, back: string) => void;
  addToggled: () => void;
  cardsData: CardsDataType;
  setCardsData: (
    f: (draft: WritableDraft<CardsDataType>) => void | CardsDataType
  ) => void;
  onCancelled: () => void;
}> = ({ setUpdate, addToggled, cardsData, setCardsData, onCancelled }) => {
  const { setDrawerVisibility } = useCardStore();

  const { cardsCache, activeId, sortedIds } = cardsData;

  const padClickedHanlder = (card: CardType) => {
    if (card.id)
      setCardsData((draft) => {
        draft.activeId = card.id;
      });

    setUpdate(card.frontValue, card.backValue);
  };

  return (
    <div
      className="flex-auto bg-[#f9f9f9] w-full overflow-scroll 
    border-r border-solid border-black-10"
    >
      <div className="flex justify-center mr-2 flex-wrap">
        <Button
          btnType="Success"
          size="Medium"
          elementType="normal"
          className="m-4 w-24 text-[0.75rem]"
          clicked={() => {
            onCancelled();
            addToggled();
            setDrawerVisibility(false);
          }}
        >
          NEW
        </Button>
      </div>
      {cardsCache &&
        sortedIds.length > 0 &&
        sortedIds.map((id, index) => (
          <Card
            index={index}
            key={id}
            title={cardsCache[id].title}
            front={cardsCache[id].frontValue}
            active={activeId ? activeId === id : false}
            clicked={() => padClickedHanlder(cardsCache[id])}
          />
        ))}
    </div>
  );
};

export default PadList;
