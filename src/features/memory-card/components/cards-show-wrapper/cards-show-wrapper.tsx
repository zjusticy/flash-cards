import { FunctionComponent } from 'react';

const CardsShowWrapper: FunctionComponent<{
  memBoard: boolean;
  preview: boolean;
  mode: boolean;
}> = ({ memBoard, preview, mode, children }) => {
  const classT =
    memBoard || preview
      ? 'bg-[#ECF5F0] h-[540px] flex justify-between'
      : 'bg-[#ECF5F0] h-[540px] [&_label]:hidden [&_form]:flex \
      [&_form]:justify-between';
  const classSelect = mode ? 'bg-[#ECF5F0] [&_label]:hidden md:w-full' : classT;

  return <div className={classSelect}>{children}</div>;
};

export default CardsShowWrapper;
