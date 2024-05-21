import "./DeleteButton.scss";

const DeleteButton = ({onClick, children, height, width}) =>{
    const divStyle={
        height: `${height}px`,
        width: `${width}px`
    };

    return(
        <a className="delete-button" onClick={onClick} style={divStyle}>
            <span>{children}</span>
        </a>
    );
};

export default DeleteButton;