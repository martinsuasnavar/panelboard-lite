import "./ProjectButton.scss";

const ProjectButton = ({selected, onClick, children}) =>{
    let divStyle={
    };
    if (selected){
        divStyle={
            color: 'black',
            backgroundColor: 'rgb(47, 255, 168)',
            borderColor: 'rgb(47, 255, 168)'
        };
    }

    return(
        <div className="project-button" onClick={onClick} style={divStyle}>
            {children}
        </div>
    );
};

export default ProjectButton;