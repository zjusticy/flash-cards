import { FunctionComponent } from 'react';
import Button from './button';
import { EditIcon, TextView } from '@/assets/images';

type Props = {
  preview: boolean;
  onClick: () => void;
};

const PreviewButton: FunctionComponent<Props> = ({ preview, onClick }) => {
  return (
    <Button
      btnType="Success"
      className="m-4 w-16 text-[0.75rem] inline-flex justify-center items-center"
      // disabled={formIsValid}
      size="Medium"
      clicked={onClick}
      elementType="normal"
    >
      {preview ? (
        <EditIcon alt="edit button" fill="rgba(9, 132, 113, 0.9)" />
      ) : (
        <TextView alt="text view" fill="rgba(9, 132, 113, 0.9)" />
      )}
    </Button>
  );
};

export default PreviewButton;
