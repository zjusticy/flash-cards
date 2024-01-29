import React from "react";

type Props = {
  active: boolean;
  index: number;
  title: string;
  front: string;
  clicked: () => void;
};

const ListCard = ({ active, index, title, front, clicked }: Props) => {
  return (
    <div
      role="button"
      className={active ? "card bg-[#FBE091]" : "card"}
      onClick={clicked}
      onKeyDown={() => {}}
      tabIndex={index}
    >
      <h3>{title}</h3>
      <p>{front}</p>
    </div>
  );
};

export default ListCard;
