import React from "react";
function CreateUser({ username, email, onChange, onCreate }) {
return (
    /* jshint ignore:start */
    <div>
    <input
        name="username"
        placeholder="할일"
        onChange={onChange}
        value={username}
    />
    
    <button onClick={onCreate}>등록</button>
    </div>
    /* jshint ignore:end */
);
}
export default CreateUser;

//https://bbangson.tistory.com/67