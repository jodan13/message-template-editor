import { useState } from "react";
import TemplateEditor from "../template-editor";
import styles from "./app.module.css";

const App = () => {
  const [isEditorOpened, setIsEditorOpened] = useState<boolean>(false);
  const arrVarNames = localStorage.arrVarNames
    ? JSON.parse(localStorage.arrVarNames)
    : ["firstName", "lastName", "company", "position"];
  const template = localStorage.template
    ? JSON.parse(localStorage.template)
    : null;
  const callbackSave = (currentTemplate: any) => {
    localStorage.setItem("template", JSON.stringify(currentTemplate));
  };

  return (
    <div className={styles.app}>
      {isEditorOpened ? (
        <TemplateEditor
          arrVarNames={arrVarNames}
          template={template}
          callbackSave={callbackSave}
          setIsEditorOpened={setIsEditorOpened}
        />
      ) : (
        <button
          type="button"
          className={styles.btn}
          onClick={() => setIsEditorOpened(true)}
        >
          Message Editor
        </button>
      )}
    </div>
  );
};
export default App;
