import "../global.scss";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { backendDomain, currentProjectName, selectedProjectId } from "../global";

import Panel from "../elements/Panel";
import Note from "../elements/Note";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import DialogBox from "../containers/DialogBox";

import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";
import Image from "../supports/Image/Image";
import { updateAny } from "../supports/Fetch/Fetch";
import { callApi } from "../supports/Fetch/Fetch";

import {DndContext} from '@dnd-kit/core';
import ThemedButton from "../buttons/ThemedButton";

const MainBoard = ({sessionKey, onUpdate, onThemeUpdate}) =>{
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //------------------------------------------------------------------------------------------------------
    // FETCHING  -------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------

    useEffect (() =>{
        verifyProject();
    }, [id])

    const [validProject, setProjectAsValid] = useState(false);
    const verifyProject = async () =>{
        try {
            setLoading(true);
            const response = await fetch(`${backendDomain}/authenticate-project?session=${sessionKey}&project=${id}`);
            if (response.status === 200) {
                setProjectAsValid(true);
                selectedProjectId.value = id;
                fetchPanels();
            } else if (response.status === 401) {
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error verifying project:', error);
        }
    }

    const [panels, setPanels] = useState([]); 
    const fetchPanels = async () =>{
        const data = await callApi(`${backendDomain}/projects/${id}/panels`, 'GET');
        setPanels(data);
        data.forEach((panel) => {
            fetchNotes(panel.panel_id);
        });
    };

    const [notes, setNotes] = useState([]);
    const fetchNotes = async (panelId) =>{
        const data = await callApi(`${backendDomain}/panels/${panelId}/notes`, 'GET');
        setNotes((prevNotes) => ({
            ...prevNotes,
            [panelId]: data                
        }));
        setLoading(false);
    };
    const createNote = async (panelId) =>{
        await callApi(`${backendDomain}/panels/${panelId}/create-note`, 'POST', { content: "New note created!" });
        fetchPanels();
    };

    const deleteProject = async () =>{
        setDialogBox(false);
        for (let i = 0; i < notes.length; i++){
            await callApi(`${backendDomain}/delete-note/${notes[i]}`, 'DELETE');
        }
        for (let i = 0; i < panels.length; i++){
            await callApi(`${backendDomain}/delete-note/${panels[i]}`, 'DELETE');
        }
        const response = await callApi(`${backendDomain}/delete-project/${id}`, 'DELETE');

        if (response.ok) {
             navigate('/');
        } else {
            console.error("Failed to delete project:", response.status, response.statusText);
        }
        onUpdate();
    };

    const [isDark, setDark] = useState(true);
    const toggleTheme = () => {
        // Call the onThemeUpdate function passed from the parent component
        onThemeUpdate(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        setDark(!isDark);
    };

    
    //------------------------------------------------------------------------------------------------------
    // UPDATE FUNCTIONS  -------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------

    const getFile = () => {
        const fileInput = document.getElementById("file-input");
        fileInput.click();
    };

    const [projectNameEditor, setProjectNameEditor] = useState(false);
    const [newProjectName, setNewProjectName] = useState(currentProjectName.name);
    const toggleProjectName = () => {
        setProjectNameEditor(!projectNameEditor);
    }
    const updateProjectName = async () => {
        currentProjectName.value = newProjectName;
        await callApi(`${backendDomain}/update-project/${id}`, "PUT", { project_name: newProjectName });
        setProjectNameEditor(false);
        onUpdate();
    };

    
    const [dialogBox, setDialogBox] = useState();
    const toggleDeleteWarning = () =>{
        setDialogBox(!dialogBox);
    }
    
    const [saveBox, setSaveBox] = useState();
    const toggleSaveWarning = () =>{
        setSaveBox(!saveBox);
    }

    const getKeyDown = (e) => {
        // If a key is pressed without the Shift key, update the note
        if (!e.shiftKey){
          switch (e.key){
            case 'Enter':
              e.preventDefault(); // Prevents adding a new line
              updateProjectName();
            break;
            case 'Escape':
              setNewProjectName(currentProjectName.value);
              setProjectNameEditor(false);
            break;
            default:
            break;
          }
        }
      };

 
    // DRAG AND DROP //
    // using dnd-kit from https://dndkit.com/

    const handleDragEnd = async ({ active, over }) => {
        if (active && over) {
            updateNoteParent(over.id, active.id);
        }
    };
    const updateNoteParent = async (panelId, noteId) => {
        await updateAny(`${backendDomain}/update-note/${noteId}/parent-panel-id`, { parent_panel_id: panelId });
        fetchPanels();
    }


    //------------------------------------------------------------------------------------------------------
    // RENDER  -------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------

    return(
        <main>
            {/**************/}
            {/* MAIN BOARD */}
            {/**************/}
            {loading ? (
                <DialogBox headMessage={"Loading, please wait... "} iconType={"info"}></DialogBox>
            ):(
                <div>
                {!validProject ? (
                    <div>
                        <DialogBox headMessage={"ERROR 401 - The permission to load up this project was not reached out. Please try again later. "}>
                        <EditButton width={120} height={30} 
                                    onClick={() => window.location.reload(false)}>
                                    Refresh page
                        </EditButton>
                        </DialogBox>
            
                    </div>
                ):(
                    <div className="project">
                        {/**************/}
                        {/* DIALOG BOX */}
                        {/**************/}
                        

                        {/* dialog box conditional, in use if a project is about to be deleted */}
                        {saveBox &&
                            <div>
                                <DialogBox headMessage={"Open a new project or save this one. WARNING: opening a new project overrides the one you've selected."}>
                                    
                                    <EditButton width={70} height={30} 
                                    onClick={() => toggleSaveWarning()}>
                                        Cancel
                                    </EditButton>


                                    <DeleteButton width={70} height={30} 
                                    onClick={() => getFile()}>
                                        Open
                                    </DeleteButton>

                                    <EditButton width={70} height={30} 
                                    onClick={() => SaveFile(panels,notes)}>
                                        Save
                                    </EditButton>

                                </DialogBox>
                            </div>
                        }


                        {dialogBox &&
                            <div>
                                <DialogBox headMessage={"Are you sure you want to delete this project?"}>

                                    <DeleteButton width={50} height={30} 
                                    onClick={() => deleteProject()}>
                                        Yes
                                    </DeleteButton>

                                    <EditButton width={50} height={30} 
                                    onClick={() => toggleDeleteWarning()}>
                                        No
                                    </EditButton>

                                </DialogBox>
                            </div>
                        }


                        {/*********/}
                        {/* BOARD */}
                        {/*********/}


                        <WhiteSpace height={50}/>

                        <section className="project-name-section">
                            <div className="project-name-elements">
                                <div style={{cursor: 'pointer'}} className="big-title-text" onDoubleClick={toggleProjectName}>
                                    { projectNameEditor ? (
                                        <div style={{display: "flex"}} onKeyDown={getKeyDown} >
                                        <EditButton width={30} height={30} onClick={() => updateProjectName()}> ✓</EditButton>
                                            <WhiteSpace width={10}/>
                                            <textarea className="project-name-change"
                                                spellcheck="false" 
                                                maxLength={20}
                                                value={newProjectName}
                                                onChange={(e) => setNewProjectName(e.target.value)}
                                                required
                                            />
                                        
                                        </div>
                                    ):(
                                        <div>{currentProjectName.value}</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <DndContext onDragEnd={handleDragEnd}>
                            <div className="panels-container">
                                {panels.map((panel, panelIndex) => (
                                    <div key={panelIndex}>
                                
                                        <Panel
                                            panelId={panel.panel_id}
                                            panelTitle={panel.panel_name}
                                            projectId={id}
                                            onClick={() => createNote(panel.panel_id)}
                                        >
                                            {notes[panel.panel_id]?.map((note, noteIndex) => (
                                                <div key={noteIndex}>
                                                    <Note id={panel} noteId={note.note_id} projectId={id} onUpdate={fetchPanels}>
                                                        {note.content}
                                                    </Note>
                                                </div>
                                            ))}
                                        </Panel>
                                
                                    </div>
                                ))}
                            </div>
                        </DndContext>


                        {/**********/}
                        {/* FOOTER */}
                        {/**********/}


                        <footer className="footer">
                            <section className="config-section">
                                    <ThemedButton height={50} width={50}
                                    onClick={toggleTheme}>
                                        {isDark && <div>☀️</div>}
                                        {!isDark && <div>🌙</div>}
                                    </ThemedButton>
                                    <WhiteSpace height={10}/>
                                    <EditButton height={50} width={50}
                                    onClick={() => toggleSaveWarning()}>
                                        <Image src="/images/save-icon.png" height={20}/>
                                    </EditButton>
                                    <WhiteSpace height={10}/>
                                    <DeleteButton height={50} width={50}
                                    onClick={() => toggleDeleteWarning()}>
                                        <Image src="/images/trash-icon.png" height={20}/>
                                    </DeleteButton>
                                
                            </section>
                        </footer>

                        {/* HTML needed to register file information */}
                        <input
                            id="file-input"
                            type="file"
                            accept=".txt"
                            style={{ display: 'none' }}
                            onChange={(event) => OpenFile(event,panels,id,fetchPanels,setNewProjectName,toggleSaveWarning,onUpdate)}
                        />
                    </div>
                )}
                </div>
            )} 
        </main>
    );
}

export default MainBoard;


async function ReplaceDataFromFile(panels,id,fetchPanels,setNewProjectName,newProjectName,newPanels){ 
    let notesCount = 0;
    let panelsCount = 0;
    const resetCounter = () =>{
        return 0;
    } //reset counter is going to be called to reinitialize notesCount or panelsCount

    const allNotes = await callApi(`${backendDomain}/notes`, 'GET');
    while(notesCount < allNotes.length){
        const currentNote = allNotes[notesCount];
        panelsCount=resetCounter();
        
        while(panelsCount < panels.length){
            const currentPanel = panels[panelsCount];
            if (currentNote.parent_panel_id === currentPanel.panel_id){
                await callApi(`${backendDomain}/delete-note/${currentNote.note_id}`, "DELETE");
            }
            panelsCount++;
        }
        notesCount++;
    }
    
    //delete the current panels in selected project
    for (panelsCount = 0; panelsCount < panels.length; panelsCount++){
        await callApi(`${backendDomain}/delete-panel/${panels[panelsCount].panel_id}`, "DELETE");
    }
    //now create the new data
    for (panelsCount = 0; panelsCount < panels.length; panelsCount++){
        await callApi(`${backendDomain}/projects/${id}/create-panel`, "POST", { panel_name: newPanels[panelsCount].panel_name });
    }
  
    //console.log('Creating note data in new panels...')

    panelsCount=resetCounter(); 
    notesCount=resetCounter();
    
    while(panelsCount < panels.length){
        while(notesCount < newPanels[panelsCount].notes.length){
            //console.log(newPanels[panelsCount].notes[notesCount].content);
            await callApi(`${backendDomain}/panels/${panels[panelsCount].panel_id}/create-note`, "POST", 
            { 
                content: newPanels[panelsCount].notes[notesCount].content 
            });
            notesCount++;
        }
        panelsCount++;
    }
    fetchPanels();
    setNewProjectName(newProjectName);
    await callApi(`${backendDomain}/update-project/${id}`, "PUT", { project_name: newProjectName });
    currentProjectName.value = newProjectName;
    
}

function OpenFile(event,panels,id,fetchPanels,setNewProjectName,toggleSaveWarning,onUpdate){
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = async (event) => {
            const content = event.target.result;
            try {
                const jsonData = JSON.parse(content);
                // Check if the JSON data has the expected structure
                if (jsonData && jsonData.saved_project && Array.isArray(jsonData.saved_project) && jsonData.saved_project.length > 0) {
                    const newProjectData = jsonData.saved_project[0];
                    const newProjectName = newProjectData.project_name;
                    const newPanels = newProjectData.panels;
                    ReplaceDataFromFile(panels,id,fetchPanels,setNewProjectName,newProjectName,newPanels);
                    toggleSaveWarning(); //close save project dialog box
                    onUpdate();
                } else {
                    console.error("Invalid JSON structure or empty data");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };
        reader.readAsText(file);
}

function SaveFile(panels,notes){
    const link = document.createElement("a");
        const jsonData = {
            saved_project: [
                {
                    project_name: currentProjectName.value,
                    panels: panels.map(panel => ({
                        panel_name: panel.panel_name,
                        notes: notes[panel.panel_id]?.map(note => ({
                            content: note.content
                        })) || [] // If notes are undefined for a panel, provide an empty array
                    }))
                }
            ]
        };
        const content = JSON.stringify(jsonData, null, 2);
        const file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = "my-panelboard-lite-data.txt";
        link.click();
        URL.revokeObjectURL(link.href);
}