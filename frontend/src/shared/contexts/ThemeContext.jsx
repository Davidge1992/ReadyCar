import React, { createContext, useState } from 'react';

export const themes = { 
    
    light: {
        backgroundColor: '#7CB9E8',
        color: '#010848'
    },
    dark: {
        backgroundColor: '#00308F',
         color: '#FFFFFF'
    }
}

export const ThemeContext = createContext(themes.light);

const ThemeContextProvider = (props) => {

    const [ currentTheme, setCurrentTheme ] = useState(themes.light);

    const toggleTheme = () => {
        currentTheme === themes.light ? 
        setCurrentTheme(themes.dark):
        setCurrentTheme(themes.light)
    }

    return (
        <ThemeContext.Provider value={{currentTheme, toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider