import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";

const Hwit = ({ hwitObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newHwit, setNewHwit] = useState(hwitObj.text);

  const onDeleteClick = async () => {
    const deleteOk = window.confirm(
      "Are you sure you want to delete this hwit"
    );
    console.log(deleteOk);
    if (deleteOk) {
      // delete
      await deleteDoc(doc(dbService, `hwits/${hwitObj.id}`));
    }
  };
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(hwitObj, newHwit);
    await updateDoc(doc(dbService, `hwits/${hwitObj.id}`), {
      text: newHwit,
    });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewHwit(value);
  };

  return (
    <div>
      {editing ? (
        <div>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your hwit"
              value={newHwit}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update hwit!" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{hwitObj.text}</h4>
          {isOwner && (
            <div>
              <button onClick={onDeleteClick}>Delete Me</button>
              <button onClick={toggleEditing}>Edit Me</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Hwit;
