import { useEffect, useState } from 'react';
import  styles from './message-template.module.css';

interface MessageTemplateProps {
  arrayForNested?: any
  id?: number
	deleteTextarea: (id: any, nodeParentId: any, nodeName: any) => void
	onFocusItem: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  fieldStructure: any
  last?: boolean
  nested?: boolean
  indexProp: number
  textarea?: string
}
const MessageTemplate: React.FC<MessageTemplateProps> = ({
  id, 
  deleteTextarea, 
  onFocusItem, 
  fieldStructure = {}, 
  indexProp,
} ) => {
  const [fieldStructureIfState, setFieldStructureIfState] = useState(fieldStructure.childrenIf)
  const [fieldStructureThenState, setFieldStructureThenState] = useState(fieldStructure.childrenThen)
  const [fieldStructureElseState, setFieldStructureElseState] = useState(fieldStructure.childrenElse)
  const [ifTextarea, setIfTextarea] = useState(fieldStructure.data.text)
  const [thenTextarea, setThenTextarea] = useState(fieldStructure.data.text)
  const [elseTextarea, setElseTextarea] = useState(fieldStructure.data.text)
  const [lastTextarea, setLastTextarea] = useState(fieldStructure.data.text)

  useEffect(()=>{
    setLastTextarea(fieldStructure.data.text)
  }, [fieldStructure.data.text])

  useEffect(()=>{
    setIfTextarea(fieldStructure.data.if)
  }, [fieldStructure.data.if])

  useEffect(()=>{
    setThenTextarea(fieldStructure.data.then)
  }, [fieldStructure.data.then])

  useEffect(()=>{
    setElseTextarea(fieldStructure.data.else)
  }, [fieldStructure.data.else])

  useEffect(() => {
    switch (fieldStructure.name) {
      case "if":
        setFieldStructureIfState(fieldStructure.childrenIf);
        break;
      case "then":
        setFieldStructureThenState(fieldStructure.childrenThen);
        break;
      case "else":
        setFieldStructureElseState(fieldStructure.childrenElse);
        break;
      default:
        break;
    }
  }, [fieldStructure]);

  return (
    <>
      <div className={styles.inputGroup}>
        <span className={styles.inputGroupText}>IF</span>
        <div className={styles.inputGroupText}>
          <button
            type="button"
            onClick={()=>deleteTextarea(
              id, 
              fieldStructure.parent.id, 
              fieldStructure.name
            )}
          >
            Delete
          </button>
        </div>
        <textarea
          className={styles.formControl}
          data-name="if"
          data-name_text='if'
          data-id={id}
          onFocus={onFocusItem}
          value={ifTextarea}
          onChange={e=>{
            fieldStructure.data.if = e.target.value
            setIfTextarea(e.target.value)
          }}
        />
      </div>
      <div className={styles.ml}>
        {fieldStructureIfState && fieldStructureIfState.map((item: { id: number; }, index: number )=>(
          <MessageTemplate 
            key={item.id} 
            id={item.id} 
            deleteTextarea={deleteTextarea} 
            onFocusItem={onFocusItem} 
            fieldStructure={fieldStructureIfState[index]} 
            indexProp={index} 
          />
        ))}
      </div>
      <div className={styles.inputGroup}>
        <span className={styles.inputGroupText}>THEN</span>
        <textarea
          className={styles.formControl}
          data-name="then"
          data-name_text='then'
          data-id={id}
          onFocus={onFocusItem}
          value={thenTextarea}
          onChange={e=>{
            fieldStructure.data.then = e.target.value
            setThenTextarea(e.target.value)
          }}
        ></textarea>
      </div>
      <div className={styles.ml}>
        {fieldStructureThenState && fieldStructureThenState.map((item: { id: number; }, index: number )=>(
          <MessageTemplate 
            key={item.id} 
            id={item.id} 
            deleteTextarea={deleteTextarea} 
            onFocusItem={onFocusItem} 
            fieldStructure={fieldStructureThenState[index]} 
            indexProp={index} 
          />
        ))}
      </div>
      <div className={styles.inputGroup}>
        <span className={styles.inputGroupText}>ELSE</span>
        <textarea
          className={styles.formControl}
          data-name="else"
          data-name_text='else'
          data-id={id}
          onFocus={onFocusItem}
          value={elseTextarea}
          onChange={e=>{
            fieldStructure.data.else = e.target.value
            setElseTextarea(e.target.value)
          }}
        ></textarea>
      </div>
      <div className={styles.ml}>
        {fieldStructureElseState && fieldStructureElseState.map((item: { id: number; }, index: number )=>(
          <MessageTemplate 
            key={item.id} 
            id={item.id} 
            deleteTextarea={deleteTextarea} 
            onFocusItem={onFocusItem} 
            fieldStructure={fieldStructureElseState[index]} 
            indexProp={index} 
          />
        ))}
      </div>
      <div className={styles.inputGroup}>
        <textarea
          className={styles.formControl}
          aria-label="With textarea"
          data-name={fieldStructure.name}
          data-id={fieldStructure.parent.id}
          data-id_item={id}
          data-name_text="text"
          onFocus={onFocusItem}
          value={lastTextarea}
          onChange={e=>{
            fieldStructure.data.text = e.target.value
            setLastTextarea(e.target.value)
          }}
        ></textarea>
      </div>
    </>
  )
}

export default MessageTemplate;