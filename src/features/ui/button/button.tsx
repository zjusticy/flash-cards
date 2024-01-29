import { FunctionComponent } from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/utils/mergeClasses";

const buttonStyle =
  "bg-transparent cursor-pointer font-bold border-none \
  font-pressStart duration-100 disabled:color-[#ccc] disabled:cursor-not-allowed \
  [&_a]:inline-block [&_a]:no-underline [&_a]:h-full [&_a]:w-full [&_a]:align-middle \
  [&_a]:text-center [&_a]:font-pressStart";

const buttonTypeStyle: {
  Success: string;
  Danger: string;
  Navi: string;
  FileM: string;
} = {
  Success:
    "outline-none text-button-color border-2 border-solid border-button-color \
    hover:bg-button-color hover:text-secondary-color [&_a]:hover:text-secondary-color \
    [&_a]:text-button-color text-button-color text-[1rem]",
  Danger: "text-[#944317] p-[10px] m-[12px]",
  Navi: "text-gray-700 w-21 h-10 text-[0.75rem]",
  FileM: "",
};

const buttonSizeStyle: { Big: string; Medium: string; Small: string } = {
  Big: "h-16 px-4 py-2 [&_a]:leading-10 [&_a]:text-[1rem]",
  Medium:
    "h-10 py-2 shadow-button-shadow active:translate-y-2 active:shadow-button-shadow-active",
  Small: "",
};

type Props = {
  btnType?: "Success" | "Danger" | "Navi" | "FileM";
  elementType: "normal" | "submit";
  disabled?: boolean;
  size?: "Big" | "Medium" | "Small";
  clicked?: () => void;
  className?: string;
  debounced?: boolean;
};

const Button: FunctionComponent<Props> = ({
  btnType,
  elementType,
  disabled,
  size,
  clicked = () => {},
  className,
  children,
  debounced = false,
}) => {
  let buttonElement = null;

  const debClick = useDebouncedCallback(clicked, 200, {
    leading: true,
    trailing: false,
  });

  const clickFunc = debounced ? debClick.callback : clicked;

  switch (elementType) {
    case "normal":
      buttonElement = (
        <button
          disabled={disabled || false}
          className={cn(
            buttonStyle,
            btnType ? buttonTypeStyle[btnType] : "",
            size ? buttonSizeStyle[size] : "",
            className || ""
          )}
          onClick={clickFunc}
          type="button"
        >
          {children}
        </button>
      );
      break;
    case "submit":
      buttonElement = (
        <button
          disabled={disabled || false}
          type="submit"
          className={cn(
            buttonStyle,
            btnType ? buttonTypeStyle[btnType] : "",
            size ? buttonSizeStyle[size] : "",
            className || ""
          )}
          onClick={clickFunc}
        >
          {children}
        </button>
      );
      break;
    default:
      buttonElement = (
        <button
          disabled={disabled || false}
          className={cn(
            buttonStyle,
            btnType ? buttonTypeStyle[btnType] : "",
            size ? buttonSizeStyle[size] : "",
            className || ""
          )}
          onClick={clickFunc}
          type="button"
        >
          {children}
        </button>
      );
  }

  return buttonElement;
};

export default Button;
