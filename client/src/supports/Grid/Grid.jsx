import React from 'react';


const Grid = ({children, templateColumns, newGap, sideMargins})=>{
  
    const defaultStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginRight: "0px",
        marginLeft: "0px",
    };

    const divStyle = {
        ...defaultStyle,
        /*   is the new value not defined?           if the new value was defined, replace the default parameter value
        /*parameter: newValue !== underfined ? newValue : default.parameter*/
        gridTemplateColumns: templateColumns !== undefined ? templateColumns : defaultStyle.gridTemplateColumns,
        gap: newGap !== undefined ? newGap : defaultStyle.gap,
        marginRight: sideMargins !== undefined ? sideMargins : defaultStyle.marginRight,
        marginLeft: sideMargins !== undefined ? sideMargins : defaultStyle.marginLeft,
    };
    
    /*using special prop {children} to render grid items*/
    return(
        <div style={divStyle} className="grid-container">
            {children}
        </div>
    );
    
}

export default Grid;