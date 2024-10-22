import React from "react";
import styles from "./Languages.module.css";

const Languages = (props) => {
  return (
    <>
      <div className={`row ${styles.languages}`}>
        <div className="col-sm-6">{props.language}</div>
        <button
          className="col-sm-3"
          onClick={() => props.deleteLanguage(props.language)}
        >
          delete
        </button>
      </div>
    </>
  );
};

export default Languages;
