import { FunctionComponent } from "react";
import * as React from "react";
// import CodeMirror from "codemirror";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/markdown/markdown";
import TurndownService from "turndown";
// import htmlSanitizer from "../../util/htmlSanitizer";
import sanitizeHtml from "sanitize-html";
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
          const html = event.clipboardData.getData("text/html");
          if (html) {
            const sanitizedHtml = sanitizeHtml(html);
            if (sanitizedHtml) {
              const cursor = editor.getDoc().getCursor();
              const line = editor.getLine(cursor.line); // get the line contents
              const pos = {
                // create a new object to avoid mutation of the original selection
                line: cursor.line,
                ch: line.length - 1, // set the character position to the end of the line
              };
              // replace(selectionMgr.selectionStart, selectionMgr.selectionEnd, turndownService.turndown(sanitizedHtml));
              editor.replaceRange(turndownService.turndown(sanitizedHtml), pos);
            }
          }

          // editor.setValue(
          //   turndownService.turndown(event.clipboardData.getData("text/plain"))
          // );
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
