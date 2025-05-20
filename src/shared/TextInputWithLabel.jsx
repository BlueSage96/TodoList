/* Recommended approach to avoid performance problems. I researched and it's not recommended to use ref as a prop without using forwardRef */
import React from 'react';
import StyledInput from "styled-components";

// move out of function to prevent focus issues
const Input = StyledInput.input `
        padding: 4px;
    `

const TextInputWithLabel = React.forwardRef(function TextInputWithLabel({elementId,label,onChange,value},ref){
    return (
        /*
            Destructures the props elementId, label, onChange, ref, and value fom te props arguments in InputWithLabel's function definition
            Assign the destructured props to the matching label props and input props
        */ 
        <>
            <label htmlFor={elementId}>{label}</label>
            <Input type="text" 
            id={elementId}  
            value={value} 
            onChange={onChange} 
            ref={ref}/>
        </>

    );
})

export default TextInputWithLabel;