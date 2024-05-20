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

function OpenFile(event,panels,id,projectFetchsPanels,setEditedProjectNameValue,toggleSaveProjectWarning,onUpdate){
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
    
                    // Now you can use projectName and panels as needed
                    console.log("Project Name:", newProjectName);
                    console.log("Panels:", newPanels);

                    console.log("Updating notes related to current panels...");
                    //delete all panels and notes (which are children of the deleted panels) and create the new data in the project
                    //indexes

                    const allNotes = await callApi(`${backendDomain}/notes`, 'GET');
                    let notesCount = 0, panelsCount = 0;
                    const resetCounter = (counter) =>{
                        counter=0;
                        return counter;
                    }

                    while(notesCount < allNotes.length){
                        const currentNote = allNotes[notesCount];
                        panelsCount=resetCounter(panelsCount);
                        
                        while(panelsCount < panels.length){
                            const currentPanel = panels[panelsCount];
                            //console.log('Panel: ' + panel.panel_id);
                            if (currentNote.parent_panel_id === currentPanel.panel_id){
                                //console.log('Deleting note with id: ' + note.note_id);
                                await callApi(`${backendDomain}/delete-note/${currentNote.note_id}`, "DELETE");
                            }
                            panelsCount++;
                        }
                        notesCount++;
                    }
                    
                    for (panelsCount = 0; panelsCount < panels.length; panelsCount++){
                        await callApi(`${backendDomain}/delete-panel/${panels[panelsCount].panel_id}`, "DELETE");
                    }
                   
                    
                    //now create the new data
                    for (panelsCount = 0; panelsCount < panels.length; panelsCount++){
                        await callApi(`${backendDomain}/projects/${id}/create-panel`, "POST", { panel_name: newPanels[panelsCount].panel_name });
                    }
                    console.log('Creating notes for the new panels...')

                    panelsCount=resetCounter(panelsCount); notesCount=resetCounter(notesCount);
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
                    projectFetchsPanels();

                    const replaceProjectName = async () => {
                        setEditedProjectNameValue(newProjectName);
                        await callApi(`${backendDomain}/update-project/${id}`, "PUT", { project_name: newProjectName });
                        currentProjectName.value = newProjectName;
                    };
                    replaceProjectName();
                   
                    toggleSaveProjectWarning();
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

const MainBoard = ({sessionKey, onUpdate, onThemeUpdate}) =>{
    const navigate = useNavigate();
    const { id } = useParams();
    const [dialogBox, setDialogBox] = useState();
    const [saveBox, setSaveBox] = useState();
    const [loading, setLoading] = useState(true);
   
    //const [projects, setProjects] = useState([]);

    const [panels, setPanels] = useState([]); 
    const [notes, setNotes] = useState([]); //notes actually



    //console.log('The session key passed to MainBoard.jsx is ' + sessionKey);
    

    //console.log('session key is :' + sessionKey)
    useEffect (() =>{
        verifyProject();
    }, [id])



    const [isEditingProjectName, setEditingProjectName] = useState(false);
    const [editedProjectNameValue, setEditedProjectNameValue] = useState(currentProjectName.name);
    const toggleProjectName = () => {
        setEditingProjectName(!isEditingProjectName);
    }
    const updateProjectName = async () => {
        currentProjectName.value = editedProjectNameValue;
        await callApi(`${backendDomain}/update-project/${id}`, "PUT", { project_name: editedProjectNameValue });
        setEditingProjectName(false);
        onUpdate();
    };
 
   
    /////////////////////
    ///// FETCHING //////
    /////////////////////
    const [validProject, setValidProjectBool] = useState(false);
    const verifyProject = async () =>{
        try {
            setLoading(true);
            const response = await fetch(`${backendDomain}/authenticate-project?session=${sessionKey}&project=${id}`);
            console.log('Getting the current project returned status: ' + response.status + '. ');
            if (response.status === 200) {
                console.log('This session is allowed to access this project');
                setValidProjectBool(true);
                selectedProjectId.value = id;
                console.log(selectedProjectId.value);
                projectFetchsPanels();
            } else if (response.status === 401) {
                console.log('Error ' + response.status + '. Unauthorized access for this session.');
                setLoading(false);
            } else {
                console.log('Error ' + response.status + '.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error verifying project:', error);
        }
    }

    const projectFetchsPanels = async () =>{
        const data = await callApi(`${backendDomain}/projects/${id}/panels`, 'GET');
        setPanels(data);
        data.forEach((panel) => {
            panelFetchsNotes(panel.panel_id);
        });
    };

    const panelFetchsNotes = async (panelId) =>{
        const data = await callApi(`${backendDomain}/panels/${panelId}/notes`, 'GET');
        setNotes((prevNotes) => ({
            ...prevNotes,
            [panelId]: data                
        }));
        setLoading(false);
    };

    
    const panelCreatesNote = async (panelId) =>{
        await callApi(`${backendDomain}/panels/${panelId}/create-note`, 'POST', { content: "New note created!" });
        projectFetchsPanels();
    };

 

    
    ///////////////////
    // DRAG AND DROP //
    ///////////////////
    // using dnd-kit from https://dndkit.com/

    const handleDragEnd = async ({ active, over }) => {
        if (active && over) {
    
            console.log('Over id: ' + over.id);
            updateNoteParent(over.id, active.id);

        }
    };
    const updateNoteParent = async (panelId, noteId) => {
        await updateAny(`${backendDomain}/update-note/${noteId}/parent-panel-id`, { parent_panel_id: panelId });
        projectFetchsPanels();
    }
    
    const [isDark, setDark] = useState(true);
    const toggleTheme = () => {
        // Call the onThemeUpdate function passed from the parent component
        onThemeUpdate(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        setDark(!isDark);
    };


    const handleOpenFileClick = () => {
        const fileInput = document.getElementById("file-input");
        fileInput.click();
    };
    const handleOpenFile = async (event) => {
        OpenFile(event,panels,id,projectFetchsPanels,setEditedProjectNameValue,toggleSaveProjectWarning,onUpdate);
    };
    const handleSaveFile = () => {
        SaveFile(panels,notes);
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
    const toggleDeleteProjectWarning = () =>{
        setDialogBox(!dialogBox);
    }
    const toggleSaveProjectWarning = () =>{
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
              setEditedProjectNameValue(currentProjectName.value);
              setEditingProjectName(false);
            break;
            default:
            break;
          }
        }
      };

    ////////////
    // RENDER //
    ////////////

    return(
        <div>
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
                                    onClick={() => toggleSaveProjectWarning()}>
                                        Cancel
                                    </EditButton>


                                    <DeleteButton width={70} height={30} 
                                    onClick={() => handleOpenFileClick()}>
                                        Open
                                    </DeleteButton>

                                    <EditButton width={70} height={30} 
                                    onClick={() => handleSaveFile()}>
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
                                    onClick={() => toggleDeleteProjectWarning()}>
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
                                    { isEditingProjectName ? (
                                        <div style={{display: "flex"}} onKeyDown={getKeyDown} >
                                        <EditButton width={30} height={30} onClick={() => updateProjectName()}> ✓</EditButton>
                                            <WhiteSpace width={10}/>
                                            <textarea className="project-name-change"
                                                spellcheck="false" 
                                                maxLength={20}
                                                value={editedProjectNameValue}
                                                onChange={(e) => setEditedProjectNameValue(e.target.value)}
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
                                            onClick={() => panelCreatesNote(panel.panel_id)}
                                        >
                                            {notes[panel.panel_id]?.map((note, noteIndex) => (
                                                <div key={noteIndex}>
                                                    <Note id={panel} noteId={note.note_id} projectId={id} onUpdate={projectFetchsPanels}>
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
                                    onClick={() => toggleSaveProjectWarning()}>
                                        <Image src="/images/save-icon.png" height={20}/>
                                    </EditButton>
                                    <WhiteSpace height={10}/>
                                    <DeleteButton height={50} width={50}
                                    onClick={() => toggleDeleteProjectWarning()}>
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
                            onChange={handleOpenFile}
                        />
                    </div>
                )}
                </div>
            )} 
        </div>
    );
}

export default MainBoard; 