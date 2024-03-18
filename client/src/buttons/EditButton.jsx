import "./EditButton.scss";

const EditButton = ({onClick, children, height, width}) =>{
    const divStyle={
        height: `${height}px`,
        width: `${width}px`
    };

    return(
        <div className="edit-button" onClick={onClick} style={divStyle}>
            <content>{children}</content>
        </div>
    );
};

export default EditButton;