import React from 'react';
import './Card_custom.css';
/**
* @author
* @function Card
**/

const Card_custom = (props) => {
  return(
    <div className='card' style={{width:props.width?props.width:'100%'}}{...props}>
        {props.children}
    </div>
   )

 }

 export default Card_custom;