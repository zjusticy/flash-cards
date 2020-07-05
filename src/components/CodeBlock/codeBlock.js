import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";

class CodeBlock extends PureComponent {
  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter language={language} style={vs}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;

CodeBlock.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string,
};

CodeBlock.defaultProps = {
  language: null,
};
