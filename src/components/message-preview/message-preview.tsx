import { useEffect, useState } from "react";
import styles from './message-preview.module.css';

const MessagePreview = ({ setModalActive, fieldTree, arrVarNames }: any) => {
  const [textareaModal, setTextareaModal] = useState<any>("");
  const [inputName, setInputName] = useState<any>({});

  const handleChange = (prop: string) => (event: { target: { value: string; }; }) => {
    setInputName((prev: any)=>{return { ...prev, [prop]: event.target.value }});
  };

  useEffect(()=>{
    const objName:any = {}
    for (let i = 0; i <= 4; i++) {
      objName[arrVarNames[i]] = '';
    }
    setInputName(objName)
  },[arrVarNames])
 
  useEffect(() => {
    const textGeneration = (arg: []) => {
      let text: any[] = [];

      function ifThenElse(ifText: any, thenText: any, elseText: any) {
        return `${
          ifText[0]
            ? [ifText[1], thenText.join("")].join("")
            : [ifText[1], elseText.join("")].join("")
        }`;
      }

      function replaceFunc(item: any) {
        return arrVarNames.reduce((res: string, current: any, index: number) => {
          return res.replace(`{${current}}`, arg[index]);
        }, item);
      }

      function pushText(text: any,  node:any) {
        text.push(
          ifThenElse(
            [replaceFunc(node.data.if), containsTree("if", node.id)],
            [replaceFunc(node.data.then), containsTree("then", node.id)],
            [replaceFunc(node.data.else), containsTree("else", node.id)]
          )
        );
        text.push(replaceFunc(node.data.text));
      }

      function containsTree(name: string, id: number) {
        let text: any[] = [];
        fieldTree.contains(function (node: {
          id: number;
          parent: any;
          name: string;
          data: any;
        }) {
          if (node.id !== 0 && node.name === name && node.parent.id === id) {
            pushText(text, node)
          }
        },
        fieldTree.traverseBF);
        return text.join("");
      }

      fieldTree.contains(function (node: {
        id: number;
        parent: any;
        name: string;
        data: any;
      }) {
        if (node.id === 0) {
          text.push(replaceFunc(node.data.text));
        } else if (node.name === "root") {
          pushText(text, node)
        }
      },
      fieldTree.traverseBF);

      return text.join("");
    };
     setTextareaModal(textGeneration(arrVarNames.map((item: string)=>inputName[item])));
  }, [ fieldTree, inputName, arrVarNames ]);

  return (
    <>
      <div className={styles.modal_header}>
        <h5 className={styles.modal_title}>Message Preview</h5>
        <button
          type="button"
          className={styles.btn_close}
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={() => setModalActive(false)}
        >X</button>
      </div>
      <div>
        <textarea
          className={styles.form_control}
          rows={10}
          value={textareaModal}
          readOnly
        />
        <div className={styles.wrap_input}>
          <label className={styles.col}>
            Variables:
            <div className={styles.row}>
            {arrVarNames && arrVarNames.map((item: string)=>(
              <label className={styles.col} key={item}>
                {item}
                <input
                  type="text"
                  className={styles.form_control}
                  placeholder={item}
                  onChange={handleChange(item)}
                />
              </label>
            ))}
            </div>
          </label>
        </div>
        <div className={styles.modal_footer}>
          <button
            type="button"
            onClick={() => setModalActive(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default MessagePreview;
