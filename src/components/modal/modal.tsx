import React from "react";
import styles from './modal.module.css';

const Modal = ({active, setActive, children}:any) => {
  return (
    <div className={styles.modal + ' ' + (active ? styles.active_modal : '')} onClick={()=>setActive(false)}>
      <div className={styles.modal_content + ' ' + (active ? styles.active_content : '')} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default Modal