import React from "react";

function User({ user, onRemove }) {
    const {username, id} = user;
    return (
        /* jshint ignore:start */
        <div>
            <b>{username}</b>
            <button onClick={() => onRemove(id)}>삭제</button>
        </div>
        /* jshint ignore:end */
    );
}
function UserList({ users, onRemove }) {
    return (
        /* jshint ignore:start */
        <div>
            {users.map((user) => (
                <User user={user} key={user.id} onRemove={onRemove} />
            ))}
        </div>
        /* jshint ignore:end */
    );
}

export default UserList;
