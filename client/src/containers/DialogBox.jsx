import './DialogBox.scss';
const DialogBox = ({headMessage, children}) =>{
    const iconStyle = {
        color: 'rgb(248, 105, 69)'
    };

 return(
    <div className="dialog-box">
        <div className="dialog-box-content">
            <div className='dialog-icon' style={iconStyle}>⚠</div>
            <div className='dialog-title'>{headMessage}</div>
            <p>
                {children}
            </p>
        </div>
    </div>
 );
}

export default DialogBox;