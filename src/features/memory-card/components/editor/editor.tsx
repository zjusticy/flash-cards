import { FunctionComponent, useState, Fragment, useEffect } from 'react';
// import CodeMirror from "codemirror";
import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/mode/markdown/markdown';
import TurndownService from 'turndown';
// import htmlSanitizer from "../../util/htmlSanitizer";
import sanitizeHtml from 'sanitize-html';
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

type Props = {
  textValue: string;
  stack?: boolean;
  inputChangedHandler: (value: string) => void;
  myPlaceHolder: string;
  // label?: string;
  className: string;
};

const Editor: FunctionComponent<Props> = ({
  textValue,
  inputChangedHandler,
  stack = false,
  myPlaceHolder,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Convert newlines to <br> tags
  const formattedPlaceholder = myPlaceHolder
    .split('\n')
    .map((line, index, array) => (
      <Fragment key={index}>
        {line || <>&nbsp;</>}
        {index < array.length - 1 && <br />}
      </Fragment>
    ));

  return (
    <div
      className={`relative p-3 box-border md:pt-4 ${
        stack ? 'md:pb-[10px]' : ''
      }`}
    >
      <CodeMirror
        value={textValue}
        options={{
          mode: 'markdown',
          lineWrapping: true,
        }}
        editorDidMount={(editor) => {
          editor.setSize('auto', '100%');
        }}
        className={`${className} outline-none bg-white font-inherit p-[6px] box-border`}
        // onBeforeChange={(editor, data, value) => {}}
        onBeforeChange={(editor, data, value) => {
          inputChangedHandler(value);
        }}
        onPaste={(editor, event) => {
          event.preventDefault();
          // const turndownService = new TurndownService({});
          const turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '----------',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            fence: '```',
            emDelimiter: '_',
            strongDelimiter: '**',
            linkStyle: 'inlined',
            linkReferenceStyle: 'full',
          });
          turndownService.escape = (str) => str; // Disable escaping
          let data = event.clipboardData.getData('text/plain');
          const html = event.clipboardData.getData('text/html');
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {textValue === '' && !isFocused && (
        <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
          {formattedPlaceholder}
        </div>
      )}
    </div>
  );
};

export default Editor;
