import { FunctionComponent } from "react";

const Backdrop: FunctionComponent<{ show: boolean; clicked: () => void }> = ({
  show,
  clicked,
}) =>
  show ? (
    <div
      className="w-full h-full fixed z-[100] left-0 top-0 bg-black bg-opacity-50"
      onClick={clicked}
      onKeyDown={() => {}}
      role="button"
      aria-label="close Modal"
      tabIndex={0}
    />
  ) : null;

export default Backdrop;
