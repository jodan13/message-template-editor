import React from "react";
import styles from "./header.module.css";

interface NavbarProps {
  arrVarNames: string[];
  onClickButton: any;
  addTextarea: any;
}
const Header: React.FC<NavbarProps> = ({
  arrVarNames,
  onClickButton,
  addTextarea,
}) => {

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div>
            {arrVarNames.map((item) => (
              <button
                key={item}
                className={styles.btn} 
                type="submit"
                name="action"
                onClick={onClickButton}
              >
                {"{" + item + "}"}
              </button>
            ))}
            <button className={styles.btnLg} onClick={addTextarea}>
              IF-THEN-ELSE
            </button>
          </div>

          <span>Message Template editor</span>
        </div>
      </nav>
    </header>
  );
};
export default Header;
