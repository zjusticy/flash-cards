import { FunctionComponent } from "react";

const CardsEditWrapper: FunctionComponent<{
  memBoard: boolean;
  preview: boolean;
  mode: boolean;
}> = ({ memBoard, preview, mode, children }) => {
  const classT =
    memBoard || preview
      ? "bg-[rgb(236, 245, 240)] h-[530px] flex justify-between"
      : "bg-[rgb(236, 245, 240)] h-[530px] [&_label]:hidden [&_form]:flex \
      [&_form]:justify-between";
  const classSelect = mode
    ? "bg-[rgb(236, 245, 240)] h-[530px] [&_label]:hidden md:w-full"
    : classT;

  return <div className={classSelect}>{children}</div>;
};

export default CardsEditWrapper;
