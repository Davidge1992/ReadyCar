import React from 'react';

import SingleFleetItem from './SingleFleetItem';

const FleetList = (props) => {

    if(!props.fleet.length){
        return(
            <div style={{textAlign: 'center'}}>No hay Ofertas en este momento</div>
        )
    }

    return (
        <ul className='list-autos'>
            { 
            props.fleet.map( auto => {
                return (
                    <SingleFleetItem 
                    id={auto.id}
                    key={auto.id}
                    name={auto.name}
                    model={auto.model}
                    carType={auto.carType}
                    seats={auto.seats}
                    gears={auto.gears}
                    clima={auto.clima}
                    image={auto.image}
                    price={auto.price}/>
                )
            })
            }        
        </ul>
    )
}

export default FleetList;