import { deleteDoc, doc, updateDoc } from "@firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Hwit = ({ hwitObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newHwit, setNewHwit] = useState(hwitObj.text);

  const onDeleteClick = async () => {
    const deleteOk = window.confirm(
      "Are you sure you want to delete this hwit"
    );
    // console.log(deleteOk);
    if (deleteOk) {
      // delete
      await deleteDoc(doc(dbService, `hwits/${hwitObj.id}`));
      await deleteObject(ref(storageService, hwitObj.attachmentUrl));
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
  // console.log(hwitObj);

  return (
    <div className="hwit">
      {editing ? (
        <div>
          <form onSubmit={onSubmit} className="container hwitEdit">
            <input
              type="text"
              placeholder="Edit your hwit"
              value={newHwit}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update hwit!" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h4>{hwitObj.text}</h4>
          {hwitObj.attachmentUrl && (
            <img src={hwitObj.attachmentUrl} alt="Image_Here" />
          )}
          {isOwner && (
            <div className="hwit__actions">
              <button onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Hwit;
