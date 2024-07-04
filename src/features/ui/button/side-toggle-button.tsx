import { FunctionComponent } from 'react';
import Button from './button';
import { CardFlip } from '@/assets/images';

type Props = {
  disabled: boolean;
  onClick: () => void;
};

const SideToggleButton: FunctionComponent<Props> = ({ onClick, disabled }) => {
  return (
    <Button
      btnType="Success"
      className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
      disabled={disabled}
      size="Medium"
      clicked={onClick}
      elementType="normal"
    >
      <CardFlip alt="flip card" fill="rgba(9, 132, 113, 0.9)" />
    </Button>
  );
};

export default SideToggleButton;
