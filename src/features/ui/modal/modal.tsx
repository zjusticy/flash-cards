import { FunctionComponent } from "react";

import Backdrop from "@/features/ui/backdrop/backdrop";

const Modal: FunctionComponent<{ show: boolean; modalClosed: () => void }> = ({
  show,
  modalClosed,
  children,
}) => (
  <>
    <Backdrop show={show} clicked={modalClosed} />
    <div
      className="modal"
      style={{
        transform: show ? "translateY(0)" : "translateY(-100vh)",
        opacity: show ? "1" : "0",
      }}
    >
      {children}
    </div>
  </>
);

export default Modal;
