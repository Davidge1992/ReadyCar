import React, { Fragment, useState } from 'react'
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io'

const SortButtons = (props) => {

    const [isUp, setIsUp] = useState(false);

    const toHightHandler = () => {
        setIsUp(true);
        props.onHighPrice()
    };

    const toLowHandler = () => {
        setIsUp(false);
        props.onLowPrice()
    };

    return(
        <Fragment>
            {
                isUp ?  <div className='sort-arrow'>
                            <button onClick={toLowHandler}> 
                            <span>Ordenar de mas costoso-barato</span><IoIosArrowDropdown /></button>
                        </div>
                    :   <div className='sort-arrow'>              
                            <button onClick={toHightHandler}> 
                            <span>Ordenar de mas barato a costoso</span><IoIosArrowDropup /></button>
                        </div>
            }         
        </Fragment>
    )
}

export default SortButtons;