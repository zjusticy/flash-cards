import { FunctionComponent } from 'react';
import Button from './button';
import { SmallSpinner } from '@/features/ui';

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
      className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
      disabled={disabled}
      size="Medium"
      clicked={onClick}
      elementType="normal"
    >
      {isGettingAiResult ? <SmallSpinner /> : 'AI'}
    </Button>
  );
};

export default AiGenButton;
