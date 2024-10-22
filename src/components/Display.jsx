import React, { useEffect, useRef, useState } from "react";
import Languages from "./Languages";

const Display = () => {
  const [languages, setLanguages] = useState([]);
  const languageRef = useRef();

  const getData = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/lab/languages");

      if (!res.ok) {
        throw new Error("getting data error");
      }

      const data = await res.json();
      setLanguages(data);
    } catch (error) {
      console.error(error.message);
    }
  };

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

    getData();
    languageRef.current.value = "";
  };

  const deleteLanguage = async (language) => {
    const res = await fetch(
      import.meta.env.VITE_SERVER + "/lab/languages/" + language,
      {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error("cannot delete language");
    }
    getData();
  };

  useEffect(() => {
    getData();
  }, []);

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

        <button className="col-md-3" onClick={addLanguage}>
          add
        </button>
      </div>
      <br />
      <div className="row">
        <div className="col-md3">Language</div>

        <br />
      </div>
      <br />
      {languages.map((item, idx) => {
        return (
          <Languages
            key={idx}
            id={idx}
            language={item.language}
            deleteLanguage={deleteLanguage}
          />
        );
      })}
    </div>
  );
};

export default Display;
