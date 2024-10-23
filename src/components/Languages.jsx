import React from "react";
import styles from "./Languages.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Languages = (props) => {
  const queryClient = useQueryClient();

  const deleteLanguage = async () => {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/lab/languages/" + props.language,
      {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("cannot delete language");
    }
  };

  const mutation = useMutation({
    mutationFn: deleteLanguage,
    onSuccess: queryClient.invalidateQueries(["languages"]),
  });

  return (
    <>
      <div className={`row ${styles.languages}`}>
        <div className="col-sm-6">{props.language}</div>
        <button className="col-sm-3" onClick={mutation.mutate}>
          delete
        </button>
      </div>
    </>
  );
};

export default Languages;
