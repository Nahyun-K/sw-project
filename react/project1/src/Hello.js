import React, {useState} from "react";

function Hello() {
    const [number, setNumber] = useState(0);

    const onIncrease = () => {
        setNumber(number + 1);
    };
    const onDecrease = () => {
        setNumber(number -1);
    };

    return (
    /* jshint ignore:start */
    <>
        <h2>{number}</h2>
        <button onClick={onIncrease}>+1</button>
        <button onClick={onDecrease}>-1</button>
    </>
    /* jshint ignore:end */
    );
}

export default Hello;
