import "./ThemedButton.scss";

const ThemedButton = ({onClick, children, height, width}) =>{
    const divStyle={
        height: `${height}px`,
        width: `${width}px`
    };

    return(
        <div className="themed-button" onClick={onClick} style={divStyle}>
            <content>{children}</content>
        </div>
    );
};

export default ThemedButton;