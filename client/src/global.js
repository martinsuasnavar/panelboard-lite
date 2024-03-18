import { callApi } from "./supports/Fetch/Fetch";
//export const backendDomain = `https://panelboard-lite-api.vercel.app/api` //vercel hoster

//BACKEND_DOMAIN
export const backendDomain = `http://localhost:5000/api`; //local development

//SELECTED_PROJECT_ID
let selectedProjectId = { value: 11 };
export { selectedProjectId };

//CURRENT_PROJECT_NAME
let currentProjectName = { value: 'undefined '};
export { currentProjectName };



var projectArray = [];
const dataReferences = ['sessions', 'projects', 'panels', 'notes'];
var DATA_ARRAYS = [];
const getAllDataTypes = async () => {
    for (let i = 0; i < dataReferences.length; i++){
        const response = await callApi(`${backendDomain}/${dataReferences[i]}`, "GET");

        console.log('new data: ' +  DATA_ARRAYS[i])
    }
    projectArray = await callApi(`${backendDomain}/projects`, "GET");
}
getAllDataTypes();
export { DATA_ARRAYS };
export { projectArray };