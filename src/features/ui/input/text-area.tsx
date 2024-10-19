import {
  FunctionComponent,
  useRef,
  useEffect,
  // KeyboardEvent,
  ChangeEvent,
} from 'react';

type Props = {
  value: string;
  changeHandler: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
  id: string;
};

const CustomTextArea: FunctionComponent<Props> = ({
  value,
  changeHandler,
  label = '',
  id = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = (): void => {
    const textarea = textareaRef.current;
    if (textarea) {
      console.log(textarea.scrollHeight);
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    changeHandler(e.target.value);

  // const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     changeHandler((prev) => prev + '\n');
  //   }
  // };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="padding-[12px] box-border">
      <label htmlFor={id} className="font-bold block mb-2">
        {label}
      </label>
      <textarea
        id={id}
        ref={textareaRef}
        className="block resize-none py-2 w-full bg-[inherit] \
        outline-none border-b-2 text-[1.5rem] text-[color:rgba(0, 0, 0, 0.5)] leading-normal"
        rows={1}
        value={value}
        // onKeyDown={handleKeyDown}
        onChange={handleChange}
        style={{ minHeight: '24px' }}
      />
    </div>
  );
};

export default CustomTextArea;
