import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styles from "./Users.module.css";
import UpdateModal from "./UpdateModal";

const Users = (props) => {
  const queryClient = useQueryClient();
  const [showUpDateModal, setShowUpdateModal] = useState(false);

  const deleteUser = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: props.id }),
    });

    if (!res.ok) {
      throw new Error("cannot delete user");
    }
  };

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: queryClient.invalidateQueries(["users"]),
  });

  return (
    <>
      {showUpDateModal && (
        <UpdateModal
          id={props.id}
          name={props.name}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      <div className={`row ${styles.users}`}>
        <div className="col-sm-4">{props.name}</div>
        <button className="col-sm-4" onClick={() => setShowUpdateModal(true)}>
          update
        </button>
        <button className="col-sm-4" onClick={mutation.mutate}>
          delete
        </button>
      </div>
    </>
  );
};

export default Users;
