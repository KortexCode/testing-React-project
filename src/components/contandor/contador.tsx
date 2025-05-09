import React from "react";

export const Contador = () => {
    const [contador, setContador] = React.useState<number>(0);
    const handlerClick = () => {
        setContador(prev => prev + 1);
    }
    return (
        <div>
            <p>Incremento: {contador}</p>
            <button onClick={handlerClick}> 
                Incrementar
            </button>
        </div>
    )
}