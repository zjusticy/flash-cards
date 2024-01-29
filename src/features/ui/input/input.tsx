import { FunctionComponent } from "react";

type Props = {
  elementType: "input" | "textarea" | "select";
  value: string;
  id: string;
  iChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tChanged?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sChanged?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  focused: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  blured: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  label?: string;
  ref?: any;
  elementConfig?: { options: { value: string; displayValue: string }[] };
};

const Input: FunctionComponent<Props> = ({
  elementType,
  value,
  id,
  iChanged,
  tChanged,
  sChanged,
  focused,
  blured,
  label = "",
  elementConfig,
  ref,
}) => {
  let inputElement = null;

  switch (elementType) {
    case "input":
      inputElement = (
        <input
          className="outline-none bg-white font-inherit padding-[12px] 
          box-border border border-gray-300 block"
          value={value}
          id={id}
          onChange={iChanged}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          className="outline-none bg-white font-inherit padding-[12px] 
          box-border resize-none border-none"
          value={value}
          id={id}
          onChange={tChanged}
          onFocus={focused}
          onBlur={blured}
          ref={ref}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className="outline-none bg-white font-inherit padding-[12px] 
          box-border"
          value={value}
          onChange={sChanged}
          id={id}
        >
          {elementConfig &&
            elementConfig.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className="outline-none bg-white font-inherit padding-[12px] 
          box-border"
          value={value}
          id={id}
          onChange={iChanged}
        />
      );
  }

  return (
    <div className="padding-[12px] box-border">
      <label htmlFor={id} className="font-bold block mb-2">
        {label}
      </label>
      {inputElement}
    </div>
  );
};

export default Input;
