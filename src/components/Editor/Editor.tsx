import { FunctionComponent } from "react";
import * as React from "react";
// import CodeMirror from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/markdown/markdown";
// import "codemirror/keymap/sublime";
import styles from "./Editor.module.scss";

require("codemirror/lib/codemirror.css");

type Props = {
  textValue: string;
  inputChangedHandler: (val: string, inputIdentifier: "front" | "back") => void;
  //   id: string;
  focusedHandler: (
    // event: React.FocusEvent<HTMLTextAreaElement>,
    value: string,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => void;
  bluredHandler: (
    // event: React.FocusEvent<HTMLTextAreaElement>,
    textValue: string,
    iniValue: string,
    inputIdentifier: "front" | "back"
  ) => void;
  side: "front" | "back";
  myPlaceHolder: string;
  label?: string;
  className: string;
};

const Editor: FunctionComponent<Props> = ({
  textValue,
  //   onChange,
  inputChangedHandler,
  //   id,
  focusedHandler,
  bluredHandler,
  side,
  myPlaceHolder,
  className,
}) => {
  //   const editorRef = useRef<HTMLTextAreaElement>(null);
  //   useEffect(() => {
  //     // Initalize
  //     const editor = CodeMirror.fromTextArea(editorRef.current as any, {
  //       mode: "markdown",
  //       theme: "default",
  //     });
  //     // listener
  //     editor.on("change", (evt: any) => {
  //       const val = evt.getValue();
  //       onChange(val, side);
  //     });
  //     editor.on("focus", (evt: any) => {
  //       const val = evt.getValue();
  //       if (val === myPlaceHolder) editor.getDoc().setValue("");
  //       focusedHandler(val, myPlaceHolder, side);
  //     });
  //     editor.on("blur", (evt: any) => {
  //       const val = evt.getValue();
  //       if (val === "") editor.getDoc().setValue(myPlaceHolder);
  //       bluredHandler(val, myPlaceHolder, side);
  //     });
  //   }, [onChange, side, focusedHandler, bluredHandler, myPlaceHolder]);
  return (
    <div className={styles.Input}>
      <CodeMirror
        value={textValue}
        options={{
          mode: "markdown",
          lineWrapping: true,
        }}
        editorDidMount={(editor) => {
          editor.setSize("auto", "100%");
        }}
        className={`${className} ${styles.InputElement}`}
        // onBeforeChange={(editor, data, value) => {}}
        onBeforeChange={(editor, data, value) => {
          inputChangedHandler(value, side);
        }}
        onBlur={(editor, event) => {
          const val = editor.getValue();
          if (val === "") editor.setValue(myPlaceHolder);
          bluredHandler(val, myPlaceHolder, side);
        }}
        onFocus={(editor, event) => {
          const val = editor.getValue();
          if (val === myPlaceHolder) editor.setValue("");
          focusedHandler(val, myPlaceHolder, side);
        }}
      />
    </div>
  );
};

export default Editor;
