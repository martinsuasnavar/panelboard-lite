import "./ProjectButton.scss";

const ProjectButton = ({selected, onClick, children}) =>{
    let divStyle={
    };
    if (selected){
        divStyle={
            color: 'black',
            backgroundColor: 'greenyellow',
            borderColor: 'greenyellow'
        };
    }

    return(
        <div className="project-button" onClick={onClick} style={divStyle}>
            {children}
        </div>
    );
};

export default ProjectButton;