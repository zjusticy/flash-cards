import { FunctionComponent } from "react";
// import CodeMirror from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/mode/markdown/markdown";
import TurndownService from "turndown";
// import htmlSanitizer from "../../util/htmlSanitizer";
import sanitizeHtml from "sanitize-html";
// import "codemirror/keymap/sublime";

// import dynamic from "next/dynamic";

// const { Controlled: CodeMirror } = dynamic(
//   () => {
//     import("codemirror/mode/markdown/markdown");
//     import("codemirror/lib/codemirror.css");
//     return import("react-codemirror2");
//   },
//   { ssr: false }
// );

// if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
//   require("codemirror/mode/markdown/markdown");
// }

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
  // label?: string;
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
  // useEffect(() => {
  //   const Meeting = async () => {
  //     const { Webcam, Player, Dom } = await import(
  //       "@/components/sdk/WebcamSDK"
  //     );
  //     await import("codemirror/mode/markdown/markdown");
  //     await import("codemirror/lib/codemirror.css");
  //   };
  // }, []);

  return (
    <div className="p-3 box-border md:p-7 md:pr-4">
      <CodeMirror
        value={textValue}
        options={{
          mode: "markdown",
          lineWrapping: true,
        }}
        editorDidMount={(editor) => {
          editor.setSize("auto", "100%");
        }}
        className={`${className} outline-none bg-white font-inherit p-[12px] box-border`}
        // onBeforeChange={(editor, data, value) => {}}
        onBeforeChange={(editor, data, value) => {
          inputChangedHandler(value, side);
        }}
        onPaste={(editor, event) => {
          event.preventDefault();
          // const turndownService = new TurndownService({});
          const turndownService = new TurndownService({
            headingStyle: "atx",
            hr: "----------",
            bulletListMarker: "-",
            codeBlockStyle: "fenced",
            fence: "```",
            emDelimiter: "_",
            strongDelimiter: "**",
            linkStyle: "inlined",
            linkReferenceStyle: "full",
          });
          turndownService.escape = (str) => str; // Disable escaping
          let data = event.clipboardData.getData("text/plain");
          const html = event.clipboardData.getData("text/html");
          if (html) {
            const sanitizedHtml = sanitizeHtml(html);
            if (sanitizedHtml) {
              data = turndownService.turndown(sanitizedHtml);
            }
          }
          const cursor = editor.getDoc().getCursor();
          // const line = editor.getLine(cursor.line); // get the line contents
          const pos = {
            // create a new object to avoid mutation of the original selection
            line: cursor.line,
            // ch: line.length - 1, // set the character position to the end of the line
            ch: cursor.ch,
          };
          if (editor.somethingSelected()) editor.replaceSelection(data);
          else editor.replaceRange(data, pos);
        }}
        onBlur={(editor) => {
          const val = editor.getValue();
          if (val === "") editor.setValue(myPlaceHolder);
          bluredHandler(val, myPlaceHolder, side);
        }}
        onFocus={(editor) => {
          const val = editor.getValue();
          if (val === myPlaceHolder) editor.setValue("");
          focusedHandler(val, myPlaceHolder, side);
        }}
      />
    </div>
  );
};

export default Editor;
