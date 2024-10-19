import { FunctionComponent } from 'react';
import Button from './button';
import { SmallSpinner } from '@/features/ui';
import { Bulb } from '@/assets/images';

type Props = {
  isGettingAiResult: boolean;
  disabled: boolean;
  onClick: () => void;
};

const AiGenButton: FunctionComponent<Props> = ({
  onClick,
  disabled,
  isGettingAiResult,
}) => {
  return (
    <Button
      btnType="Success"
      className="m-4 w-20 text-[0.75rem] inline-flex justify-center items-center"
      disabled={disabled}
      size="Medium"
      clicked={onClick}
      elementType="normal"
    >
      {isGettingAiResult ? (
        <SmallSpinner />
      ) : (
        <>
          <span className="pl-2">AI</span>
          <Bulb
            alt="bulb"
            fill="rgba(9, 132, 113, 0.9)"
            className="h-8 w-8 pl-2 pb-1 pr-2"
          />
        </>
      )}
    </Button>
  );
};

export default AiGenButton;
