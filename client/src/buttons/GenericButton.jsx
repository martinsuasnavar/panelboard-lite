const GenericButton = ({onClick, children, height, width}) =>{
    const divStyle={
        height: `${height}px`,
        width: `${width}px`
    };

    return(
        <a className="edit-button" onClick={onClick} style={divStyle}>
            <span>{children}</span>
        </a>
    );
};

export default GenericButton;
