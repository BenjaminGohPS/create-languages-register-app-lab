import React, { useEffect, useRef, useState } from "react";
import Languages from "./Languages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Users from "./Users";

const Display = () => {
  const queryClient = useQueryClient();
  const languageRef = useRef();
  const nameRef = useRef();

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

  const getUser = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users");

    if (!res.ok) {
      throw new Error("getting user error");
    }

    const data = await res.json();
    return data;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const addUser = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: nameRef.current.value,
      }),
    });

    if (!res.ok) {
      throw new Error("cannot add user");
    }
  };

  const mutationUser = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      nameRef.current.value = "";
      queryClient.invalidateQueries(["users"]);
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
          className="col-md-3"
        />

        <button className="col-md-2" onClick={mutation.mutate}>
          add
        </button>

        <div className="col-md-1"></div>

        <input
          type="text"
          ref={nameRef}
          placeholder="name"
          className="col-md-3"
        />

        <button className="col-md-2" onClick={mutationUser.mutate}>
          add
        </button>
      </div>
      <br />

      <div className="row">
        <div className="col-md-2">Language</div>
        <div className="col-md-4"></div>
        <div className="col-md-1">User</div>
        <br />
      </div>
      <br />
      <div className="col-md-5">
        {query.isSuccess &&
          query.data.map((item, idx) => {
            return <Languages key={idx} id={idx} language={item.language} />;
          })}
      </div>
      <div className="col-md-1"></div>
      <div className="col-md-5">
        {queryUser.isSuccess &&
          queryUser.data.map((item, idx) => {
            return (
              <Users key={idx} id={idx} name={item.name} user_id={item.id} />
            );
          })}
      </div>
    </div>
  );
};

export default Display;
