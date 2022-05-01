import ReactAce from "react-ace";

import "brace/mode/javascript";
import "brace/theme/monokai";

import "brace/snippets/javascript";
import "brace/ext/language_tools";

type Props = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
};

const AceEditor = ({ code, setCode }: Props) => {
  const onChange = (newVal, e) => {
    setCode(newVal);
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
      name="ACE_EDITOR_REACT"
      mode="javascript"
      theme="monokai"
      onChange={onChange}
      style={{ height: "100%", width: "100%" }}
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
