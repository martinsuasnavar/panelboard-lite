

//BACKEND_DOMAIN_API
let localHost = false;
if (window.location.href.indexOf("localhost") > -1) {
    localHost = true;
}
let customDomain = false;

const localPort = 5000;

let backendDomain = `https://panelboard-lite-api.vercel.app/api`;
if (localHost){
    backendDomain = `http://localhost:${localPort}/api`;
}
if (customDomain){
    backendDomain = `?:${localPort}/api`;
}
export { backendDomain };




//SELECTED_PROJECT_ID
let selectedProjectId = { value: 11 };
export { selectedProjectId };




//CURRENT_PROJECT_NAME
let currentProjectName = { value: 'undefined '};
export { currentProjectName };



//CURRENT_EDITED_NOTE_ID
let editingNoteId = { value: 0 }
export { editingNoteId };


//get data arrays, unnecessary?
var projectArray = [];
/*
const dataReferences = ['sessions', 'projects', 'panels', 'notes'];
var DATA_ARRAYS = [];
const getAllDataTypes = async () => {
    for (let i = 0; i < dataReferences.length; i++){
        const response = await callApi(`${backendDomain}/${dataReferences[i]}`, "GET");

        //console.log('new data: ' +  DATA_ARRAYS[i])
    }
    projectArray = await callApi(`${backendDomain}/projects`, "GET");
}
getAllDataTypes();
export { DATA_ARRAYS };
export { projectArray };
*/