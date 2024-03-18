import "./DeleteButton.scss";

const DeleteButton = ({onClick, children, height, width}) =>{
    const divStyle={
        height: `${height}px`,
        width: `${width}px`
    };

    return(
        <div className="delete-button" onClick={onClick} style={divStyle}>
            <content>{children}</content>
        </div>
    );
};

export default DeleteButton;