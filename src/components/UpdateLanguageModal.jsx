import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./UpdateLanguageModal.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const OverLay = (props) => {
  const queryClient = useQueryClient();
  const languageRef = useRef();
  const nameRef = useRef();
  const [selection, setSelection] = useState();

  const addUserLanguage = async () => {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/lab/users/languages",
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          user_id: props.selection,
          language: languageRef.current.value,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("cannot add user language");
    }
  };

  const mutation = useMutation({
    mutationFn: addUserLanguage,
    onSuccess: () => {
      languageRef.current.value = "";
      props.setShowUpdateLanguageModal(false);
      queryClient.invalidateQueries(["userLanguage"]);
    },
  });

  const handleSelectionChange = (event) => {
    setSelection(event.target.value);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <br />

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Language</div>
          <div
            ref={nameRef}
            type="text"
            className="col-md-3"
            defaultValue={props.name}
          />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-6">
            <select
              id={"selection"}
              className="col-md-6"
              onChange={handleSelectionChange}
              value={selection}
            >
              {props.query.isSuccess &&
                props.query.data.map((item, idx) => {
                  return (
                    <option key={idx} id={idx} value={item.lanuage}>
                      {item.language}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-3"></div>
          <button className="col-md-3" onClick={mutation.mutate}>
            add
          </button>

          <button
            className="col-md-3"
            onClick={() => {
              props.setShowUpdateLanguageModal(false);
            }}
          >
            cancel
          </button>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
};

const UpdateLanguageModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          selection={props.selection}
          setShowUpdateLanguageModal={props.setShowUpdateLanguageModal}
          query={props.query}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateLanguageModal;
