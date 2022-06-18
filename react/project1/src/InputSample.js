import React, { useState, useRef } from "react";
function User ({rename}) {
    return (
    /* jshint ignore:start */
    <div>
        <b>{rename}</b>
    </div>
    /* jshint ignore:end */
    );
}
function InputSample() {
     const [inputs, setInputs] = useState({
         name: "",
     });
     var res = "";
     const nameInput = useRef();
     
     const { name } = inputs; // inputs에서 name 추출
     const onChange = (e) => { // 과제에 꼭 필요한 코드
     const {value, name} = e.target;
         
         setInputs({
            // jshint ignore:start
            ...inputs, // 전개 연산자 기존에 갖고 있던 input 값을 그대로 가져옴
            // jshint ignore:end
             [name]: value,
         });
     };

     const onReset = () => {
         setInputs({
            name: name,
            });
            nameInput.current.focus();
     };
     const onRegist = () => {
        setInputs({
            res: name,
            name: "",
           });
           console.log({name});
           res = name;
           console.log({res});
           nameInput.current.focus();
    };

    return (
        /* jshint ignore:start */
       <div>
           <input name="name" placeholder="할일" onChange={onChange} value={name} ref={nameInput}/>
           <button onClick={onRegist}>등록</button>
           <div>
               <div onClick={onRegist}>
                   <User rename={name} />
                </div>
               <button  onClick={onReset}>삭제</button>
               
           </div>
        </div>
       /* jshint ignore:end */
        );
}

export default InputSample;