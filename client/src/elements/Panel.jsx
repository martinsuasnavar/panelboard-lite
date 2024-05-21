import "./Panel.scss";
import { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
import { editingNoteId } from "../global";

import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";
//import Note from "./Note";

import AddButton from "../buttons/AddButton";

import { useDroppable } from "@dnd-kit/core";

const Panel = ({ height, projectId, panelId, panelTitle, children, onClick }) => {
    const { isOver, setNodeRef: setDroppableRef } = useDroppable({
        id: panelId,
        index: panelId,
    });


    const handleDrop = async () => {
      if (isOver) {
        // Implement logic to handle the drop event on the panel
        console.log(`Note dropped on panel ${panelId}`);
      }
    };

    const style = {
      borderStyle: 'solid',
      borderColor: isOver ? 'rgba(0, 119, 255, 0.2)' : 'rgba(0, 119, 255, 0.1)',
    };

    return (
        <main
          className="panel"
          ref={setDroppableRef}
          style={style}
          onDrop={handleDrop}
        >
          <section className="title">
            <div>{panelTitle}</div>
            <AddButton squareSize={30} onClick={onClick} />
          </section>
          <WhiteSpace height={10} />
          {/*<div style={{color: 'grey'}}>panel-{panelId}  </div>*/}
          {children}
        </main>
      );
    };
    
    export default Panel;