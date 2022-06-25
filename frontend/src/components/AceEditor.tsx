import ReactAce from "react-ace";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/mode-javascript";

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
      theme="dracula"
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
