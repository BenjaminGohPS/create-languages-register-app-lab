import React from "react";
import styles from "./UserDetails.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UserDetails = (props) => {
  const queryClient = useQueryClient();

  const deleteUserLanguage = async () => {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/lab/users/languages",
      {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          user_id: props.selection,
          language: props.item,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("cannot delete user language");
    }
  };

  const mutation = useMutation({
    mutationFn: deleteUserLanguage,
    onSuccess: queryClient.invalidateQueries(["userLanguage"]),
  });

  return (
    <>
      <div className={`row ${styles.UserDetails}`} key={props.idx}>
        <div className="col-sm-6">{props.item}</div>
        <button className="col-sm-6" onClick={mutation.mutate}>
          delete
        </button>
      </div>
    </>
  );
};

export default UserDetails;
