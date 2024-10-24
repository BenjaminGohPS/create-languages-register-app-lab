import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const OverLay = (props) => {
  const queryClient = useQueryClient();
  const nameRef = useRef("");

  const updateUser = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users", {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        user_id: props.id,
        name: nameRef.current.value,
      }),
    });
    if (!res.ok) {
      throw new Error("cannot update user");
    }
  };

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      props.setShowUpdateModal(false);
    },
  });

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <br />

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Name</div>
          <input
            ref={nameRef}
            type="text"
            className="col-md-3"
            defaultValue={props.name}
          />
          <div className="col-md-3"></div>
        </div>

        <br />

        <div className="row">
          <div className="col-md-3"></div>
          <button className="col-md-3" onClick={mutation.mutate}>
            update
          </button>
         
          <button
            className="col-md-3"
            onClick={() => {
              props.setShowUpdateModal(false);
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

const UpdateModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          id={props.id}
          name={props.name}
          setShowUpdateModal={props.setShowUpdateModal}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateModal;
