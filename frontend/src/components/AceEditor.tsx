import ReactAce from "react-ace";
import brace from "brace";

import "brace/mode/javascript";
import "brace/theme/monokai";

import "brace/snippets/javascript";
import "brace/ext/language_tools";

type Props = {};

const AceEditor = (props: Props) => {
  const onChange = (newVal, e) => {
    console.log({ newVal });
  };
  const onLoad = (editor) => {
    // editor.setOptions({
    //   enableSnippets: true,
    //   enableBasicAutocompletion: true,
    //   enableLiveAutocompletion: true,
    // });
  };
  return (
    <ReactAce
      mode="javascript"
      theme="monokai"
      onChange={onChange}
      style={{ height: "70vh", width: "100%" }}
      readOnly={false}
      fontSize={18}
      onLoad={onLoad}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
};

export default AceEditor;
