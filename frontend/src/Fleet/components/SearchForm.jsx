import React, { useState } from 'react'

const SearchForm = (props) => {

    const [ name, setName ] = useState('');

    const onSubmitNameHandler = (e) => {
        const convName = name.toLocaleLowerCase()
        e.preventDefault();
        props.onSubmitNameHandler(convName);
        setName('');
    };

    return(
        <div className='search-form'>
            <form onSubmit={onSubmitNameHandler}>
                    <input type='text' name='name' value={name} placeholder='Ingresa el nombre, modelo o tipo'
                    required onChange={(e) => setName(e.target.value)} />
                    {
                        props.onSearch 
                        ? <button className='clear-search' onClick={props.onSearchClear}>Borrar</button>
                        : <input type='submit' value='Buscar' />
                    }                   
            </form>
        </div>
    )
}

export default SearchForm;