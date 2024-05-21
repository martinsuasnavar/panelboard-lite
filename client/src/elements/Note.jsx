// Note.js
import "./Note.scss";
import React, { useEffect, useState } from "react";
import { backendDomain, editingNoteId } from "../global";

import Image from "../supports/Image/Image";
import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";

import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";

// DRAG AND DROP (dnd kit)
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { updateAny } from "../supports/Fetch/Fetch";
import { callApi } from "../supports/Fetch/Fetch";

const Note = ({ noteId, projectId, containerId, children, onUpdate, onGreenClick, onRedClick, noteCrudCounter, canEdit }) => {
  const [isEditing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(children);
  //console.log("Note id: " + noteId);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: noteId,
    containerId
  });

  const style = {
    transform: CSS.Translate.toString(transform)
  };


  const toggleEditing = () => {
    setEditing(!isEditing);
    editingNoteId.value = noteId;
    console.log(editingNoteId.value);
    stopEditing();
  };

  useEffect(() => {
    stopEditing();
  }, [editingNoteId.value]);

  const stopEditing = () => {
    if (noteId != editingNoteId.value){
      setEditedContent(children);
      setEditing(false);
    }
  }
 

  const getKeyDown = (e) => {
    // If a key is pressed without the Shift key, update the note
    if (!e.shiftKey){
      switch (e.key){
        case 'Enter':
          e.preventDefault(); // Prevents adding a new line
          updateNote();
        break;
        case 'Delete':
          deleteNote();
        break;
        case 'Escape':
          setEditedContent(children);
          setEditing(false);
        break;
      }
    }
  };

  //
  //// fetching
  //

  const updateNote = async () => {
    let actualEditedContent = " ";
    if (editedContent == ""){
      actualEditedContent = "My project"
    }else{
      actualEditedContent = editedContent;
    }
    await updateAny(`${backendDomain}/update-note/${noteId}`, { content: actualEditedContent });
    setEditing(false);
    onUpdate();
};


  //note deletes itself
  const deleteNote = async () => {
    const response = await callApi(`${backendDomain}/delete-note/${noteId}`, 'DELETE');
    setEditing(false);
    if (response.ok){
      console.log('Note deleted');
      onUpdate();
    }
  }
  
 

  return (
    <section className="note-section">
      {/* WRITTABLE AND DRAGGABLE NOTES */}

      <div onDoubleClick={toggleEditing}>

        {/* Note main UI conditional */}
        {isEditing ? (
          <div className='note' onKeyDown={getKeyDown}>
            <div className="note-edit-zone">
              <textarea
               spellcheck="false" 
                maxLength={30}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                required
              />
            </div>
          </div>
        ) : (
          <div className='note'
              ref={setNodeRef} 
              style={style} 
              {...listeners} 
              {...attributes}>
            <content>
              {children}
            </content>
            <WhiteSpace width={50} />
          </div>
        )}
      </div>
      

      {/* Note buttons conditional */}
      {isEditing ? (
        <div className="note-buttons">
          <EditButton onClick={updateNote} width={30} height={30}>
            ✓
          </EditButton>
          <WhiteSpace width={10} />
          <DeleteButton onClick={deleteNote} width={30} height={30}>
            <Image src="/images/trash-icon.png" height={20} />
          </DeleteButton>
        </div>
      ) : (
        <section>
          {/* nothing is displayed */}
        </section>
      )}


    </section>
  );
};

export default Note;