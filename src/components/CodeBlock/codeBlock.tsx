import * as React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";

type Props = {
  language: string;
  value: string;
};

const CodeBlock = (props: Props) => {
  const { language, value } = props;
  return (
    <SyntaxHighlighter language={language} style={vs}>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
