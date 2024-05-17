import './DialogBox.scss';
const DialogBox = ({headMessage, children, iconType}) =>{
    let icon = "⚠";

    let iconStyle = {
        color: 'rgb(248, 105, 69)'
    };
    if (iconType == "info"){
        icon = "ⓘ";
        iconStyle = {
            color: 'rgb(20, 183, 195)'
        };
    }

    

 return(
    <div className="dialog-box">
        <div className="dialog-box-content">
            <div className='dialog-icon' style={iconStyle}>{icon}</div>
            <div className='dialog-title'>{headMessage}</div>
            <p>
                {children}
            </p>
        </div>
    </div>
 );
}

export default DialogBox;