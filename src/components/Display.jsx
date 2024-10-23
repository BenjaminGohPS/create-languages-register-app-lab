import React, { useEffect, useRef, useState } from "react";
import Languages from "./Languages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Display = () => {
  const queryClient = useQueryClient();
  const languageRef = useRef();

  const getData = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/languages");

    if (!res.ok) {
      throw new Error("getting data error");
    }

    const data = await res.json();
    return data;
  };

  const query = useQuery({
    queryKey: ["languages"],
    queryFn: getData,
  });

  const addLanguage = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/languages", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        language: languageRef.current.value,
      }),
    });

    if (!res.ok) {
      throw new Error("cannot add language");
    }
  };

  const mutation = useMutation({
    mutationFn: addLanguage,
    onSuccess: () => {
      languageRef.current.value = "";
      queryClient.invalidateQueries(["languages"]); // means tell the client that the existing data is not valid, go get new ones.
    },
  });

  return (
    <div className="row">
      <h1>Languages</h1>
      <br />

      <div className="row">
        <input
          type="text"
          ref={languageRef}
          placeholder="language"
          className="col-md-6"
        />

        <button className="col-md-3" onClick={mutation.mutate}>
          add
        </button>
      </div>
      <br />
      <div className="row">
        <div className="col-md3">Language</div>

        <br />
      </div>
      <br />
      {query.isSuccess &&
        query.data.map((item, idx) => {
          return <Languages key={idx} id={idx} language={item.language} />;
        })}
    </div>
  );
};

export default Display;
