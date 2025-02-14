import React from "react";

const Button = ({label, onPress, className}) =>{
    return(
        <div className={`calcbutton + ${className}`} onClick={onPress}>
            <button >{label}</button>
        </div>
    )
}

export default Button