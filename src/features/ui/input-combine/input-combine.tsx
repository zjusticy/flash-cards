type Props = {
  name: string;
  listName: string;
  tag: string;
  inputChangedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const InputCombine = ({
  name,
  tag,
  listName,
  type,
  inputChangedHandler,
}: Props) => (
  <div
    className="max-w-[480px] grow relative border-2 border-[#dddddd] \
  h-full box-border"
  >
    <label
      className="block absolute mt-[-1.25rem] ml-[1rem] bg-[#ffffff] \
    h-4 p-1 pb-4 text-[color:#b9b9b9] text-[16px] font-pressStart"
      htmlFor={name}
    >
      {tag}
    </label>
    <input
      className="block py-2 px-5 w-full h-full box-border \
      outline-none border-none text-[1.5rem] text-[color:rgba(0, 0, 0, 0.5)]"
      name={name}
      value={listName}
      type={type || "text"}
      onChange={inputChangedHandler}
    />
  </div>
);

export default InputCombine;
