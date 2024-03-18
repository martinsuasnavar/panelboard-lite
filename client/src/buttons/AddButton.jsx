import "./AddButton.scss";

const AddButton = ({onClick, squareSize}) =>{
    const divStyle = {
        width: `${squareSize}px`,
        height: `${squareSize}px`,
    };

    return(
        <a className="add-button" onClick={onClick} style={divStyle}>
            <div className="add-button-text">+</div>
        </a>
    );
};

export default AddButton;