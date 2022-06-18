import React, { useState } from "react";

function Counter() {
    const [number, setNumber] = useState(0);

    const onIncrease = () => {
        setNumber(number + 1);
        console.log(number);
    };
    const onDecrease = () => {
        setNumber(number - 1);
        console.log(number);
    };
    return (
    /* jshint ignore:start */
   <div>
       <h1>{number}</h1>
       <button onClick={onIncrease}>1</button>
       <button onClick={onDecrease}>-1</button>
    </div>
   /* jshint ignore:end */
    );
}

export default Counter;