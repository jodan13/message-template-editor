import { useEffect, useRef, useState } from "react";
import Header from "../header";
import MessageTemplate from "../message-template";
import MessagePreview from "../message-preview";
import Footer from "../footer";
import Tree from "../../lib/tree";
import Modal from "../modal";
import styles from './template-editor.module.css'

const TemplateEditor = ({ arrVarNames, template, callbackSave, setIsEditorOpened }:any) => {
  const [modalActive, setModalActive] = useState(false) 
  const [fieldTreeArr, setFieldTreeArr] = useState<any>([])
  const [fieldTree, setFieldTree] = useState<any>(new Tree({ if: '', then: '', else: '', text:''}))
  const [textareaFirstState, setTextareaFirstState] = useState<string>('')
  const textarea = useRef<any>(null);

  useEffect(()=>{setFieldTree((prev: any)=>{
    let savedTemplate: any 
    if (Array.isArray(template) && template[0].data && template[0].name && template[0].id === 0){
      savedTemplate = new Tree(template[0].data)
      template.forEach((element: any, index) => {
        if (index !== 0){
          savedTemplate.add(
            element.data, 
            element.parenId,
            element.name, 
            element.id, 
            savedTemplate.traverseBF
          )
        }
      });
      setFieldTreeArr([...savedTemplate._root.children])
      return savedTemplate
    }
    return prev
  })}, [template])

  useEffect(() => {
    setTextareaFirstState(fieldTree._root.data.text)
  }, [fieldTree._root.data.text]);
  const saveTemplate = (fieldTree: { contains: (arg0: (node: { id: number; parent: any; name: string; data: any; }) => void, arg1: any) => void; traverseBF: any; }) => {
    const arrTemplate: { data: any; id: number; name: string; parenId: any; }[] = []
    fieldTree.contains(function(node: { id: number; parent:any; name: string, data:any }){

      arrTemplate.push({      
        data: node.data,
        id: node.id,
        name: node.name,
        parenId: node.parent ? node.parent.id : null
      })
    }, fieldTree.traverseBF);

    callbackSave(arrTemplate)
  }

  const onClickButton = (e: React.ChangeEvent<HTMLButtonElement>) => {

    insertTextAtCursor(textarea.current, `${e.target.textContent}`);
  };

  function deleteTextarea(id: number, nodeParentId: any, nodeName: any) {
    fieldTree.remove(id, nodeParentId, fieldTree.traverseBF, nodeName)
    setFieldTreeArr([...fieldTree._root.children])
  }

  function cursor_position(area: { focus: () => void; selectionStart: any; }) {
    area.focus();
    if (area.selectionStart) {
      return area.selectionStart; 
    }
    return 0;
  }

  const onFocusItem = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		textarea.current = event.target;
	}

function addPastedTextToTree(node:any, textarea:any) {
  switch (textarea.current!.dataset.name_text) {
    case "if":
      node.data.if = textarea.current.value
      break;
    case "then":
      node.data.then = textarea.current.value
      break;
    case "else":
      node.data.else = textarea.current.value
      break;
    default:
      break;
  }
}

  function addTextarea() {
    const selectionStart = cursor_position(textarea.current)
    const value = textarea.current.value
    const objectTemplate =  { if: '', then: '', else: '', text: value.substring(selectionStart, textarea.current.value.length) }
    textarea.current.value = value.substring(0, selectionStart)

    fieldTree.contains(function(node: { id: number; parent:any; name: string, data:any }){
      if (node.id === +textarea.current!.dataset.id) {
        fieldTree.add(
          objectTemplate, 
          textarea.current!.dataset.id, 
          textarea.current!.dataset.name, 
          textarea.current!.dataset.id_item, 
          fieldTree.traverseBF
        )
        setFieldTreeArr([...fieldTree._root.children])
        addPastedTextToTree(node, textarea)
      }
      if (node.id === +textarea.current!.dataset.id_item && node.parent && node.parent.id === +textarea.current!.dataset.id) {
        node.data.text = textarea.current.value.substring(0, selectionStart)
      }
      if (node.id === +textarea.current!.dataset.id_item && node.id === +textarea.current!.dataset.id) {
        node.data.text = textarea.current.value.substring(0, selectionStart)
      }
    }, fieldTree.traverseBF);
  }

  function insertTextAtCursor(elem: HTMLTextAreaElement | null, text: string) {
    const el = elem!;
    const val = el.value;
    let  endIndex;
    if (
      typeof el.selectionStart == "number" &&
      typeof el!.selectionEnd == "number"
    ) {
      endIndex = el!.selectionEnd;
      el.value = val.slice(0, endIndex) + text + val.slice(endIndex);
      el.selectionStart = el.selectionEnd = endIndex + text.length;
    }
    if (el.selectionStart) {
      el.focus();
      el.setSelectionRange(0, 0);
    }
    fieldTree.contains(function(node: { id: number; parent:any; name: string, data:any }){
      if (textarea.current!.dataset.id_item && node.id === +textarea.current!.dataset.id_item){
        addPastedTextToTree(node, textarea)
      } else if (node.id === +textarea.current!.dataset.id) {
        addPastedTextToTree(node, textarea)
      }
    }, fieldTree.traverseBF);
  }

  return (
    <>
      <Header
        arrVarNames={arrVarNames}
        onClickButton={onClickButton}
        addTextarea={addTextarea}
      />
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <textarea
            ref={textarea}
            className={styles.formControl}
            data-name="root"
            data-id="0"
            data-id_item="0"
            data-name_text="text"
            onFocus={onFocusItem}
            value={textareaFirstState}
            onChange={e=>{
              fieldTree._root.data.text = e.target.value
              setTextareaFirstState(e.target.value)
            }}
          ></textarea>
        </div>
        {fieldTreeArr.map((item: any, index: number )=>(
          <MessageTemplate 
            key={item.id} 
            id={item.id}
            deleteTextarea={deleteTextarea} 
            onFocusItem={onFocusItem} 
            fieldStructure={fieldTree._root.children[index]} 
            indexProp={index}
          />
        )) }
        
      </div>
      <div className={styles.alignSelfCenter}>
        <button className={styles.btn} type="button" onClick={()=>setModalActive(true)}>
          Preview
        </button>
        <button className={styles.btn} type="button" onClick={()=>saveTemplate(fieldTree)}>
          Save
        </button>
        <button className={styles.btn} type="button" onClick={() => setIsEditorOpened(false)}>
          Close
        </button>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <MessagePreview setModalActive={setModalActive} fieldTree={fieldTree} arrVarNames={arrVarNames} />
      </Modal>
      <Footer/>
    </>
  )
}
export default TemplateEditor