import "./ProjectsNavBar.scss";
import ProjectButton from "../buttons/ProjectButton";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddButton from "../buttons/AddButton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { backendDomain, selectedProjectId, currentProjectName } from "../global";
import { callApi } from "../supports/Fetch/Fetch";
import { DATA_ARRAYS } from "../global";

const ProjectsNavBar = ({sessionKey, updatedStatus}) =>{
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const { id } = useParams();
    const [project, setSelectedProject] = useState();
    const [currentProjectId, setCurrentProjectId] = useState(id);

    console.log('The session key passed to ProjectsNavBar.jsx is ' + sessionKey);

    //
    //// fetching
    //

    // We are using useEffect to connect to an external system outside of the React front-end, in this case our back-end
    useEffect(() => {
        fetchProjects();
    }, []);


    useEffect(() => {
        fetchProjects();
    }, [id, updatedStatus]);

   const createProject = async (e) => {
        await callApi(`${backendDomain}/create-project`, 'POST', {name: `Project ${projects.length + 1}`, associated_session_key: sessionKey})
        fetchProjects();
       
    };

    const fetchProjects = async () =>{
        const data = await callApi(`${backendDomain}/sessions/${sessionKey}/projects`, 'GET');
        setProjects(data);
    }
    
    //console.log(projects)
    let currentProjectIndex = 0;


    const navigateToProject = (projectId, index, projectName) =>{
        
        setSelectedProject(projectId);
        navigate(`/projects/${projectId}`);
        //selectedProjectId.value = projectId;
        currentProjectIndex = index;
        currentProjectName.value = projectName;
    } 

   
  
    useEffect(() => {
        const getKeyDown = (e) => {
        if (projects[currentProjectIndex].project_id != undefined){
          if (e.ctrlKey) {
            switch (e.key) {
              case 'ArrowLeft':
                    if (currentProjectIndex === 0){
                        navigateToProject(  projects[projects.length - 1].project_id, 
                                            projects.length - 1, 
                                            projects[currentProjectIndex].project_name  );
                    }else{
                        navigateToProject(  projects[currentProjectIndex - 1].project_id, 
                                            currentProjectIndex - 1, 
                                            projects[currentProjectIndex].project_name  );
                    }
                break;
              case 'ArrowRight':
                    if (currentProjectIndex === projects.length - 1){
                        navigateToProject(  projects[0].project_id, 
                                            0, 
                                            projects[currentProjectIndex].project_name  );
                    }else{
                        navigateToProject(  projects[currentProjectIndex + 1].project_id, 
                                            currentProjectIndex + 1, 
                                            projects[currentProjectIndex].project_name  );
                    }
                break;
            }
          }
        };
    
        // Add event listener when the component mounts
        document.addEventListener('keydown', getKeyDown);
    
        // Remove event listener when the component unmounts
        return () => {
          document.removeEventListener('keydown', getKeyDown);
        };
}}, []); // Empty dependency array means this effect runs once when the component mounts
    


    return(
        <ul className="navbar" >
            <div style={{display: 'flex'}}>
                <AddButton onClick={createProject} squareSize={27}></AddButton>
        
                <div className="nav-buttons">
                    {projects.map((aProject, index) =>(
                        <ul  key={index}>
                            <li><ProjectButton selected={aProject.project_id == project} onClick={() => navigateToProject(aProject.project_id, index, aProject.project_name)}>
                                {aProject.project_name}
                            </ProjectButton></li>
                        </ul>
                    ))}
                </div>
            </div>
        </ul>
    );
};

export default ProjectsNavBar;