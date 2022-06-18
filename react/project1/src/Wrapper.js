import React from "react";

function Wrapper({children}) {
    const style = {
        backgroundColor: "aqua",
        border: "2px solid black",
        padding: "16px",
    };
    
    return (
    /* jshint ignore:start */
    <>
        <div style={style}>{children}</div>
    </>
    /* jshint ignore:end */
    );
}

export default Wrapper;