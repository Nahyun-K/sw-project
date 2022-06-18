import "./App.css";
import BarSek from "./BarSek.js";
// import BarSek from "./Change";
import Bar from "./Bar.js";
import React, { useState } from "react";
import AgeChart from "./AgeSek";
import Scatter from "./src/scatter";
import Prac4 from "./Prac4";

function App() {

  const [count, setCount] = useState(1);

  return( 
    <>
      
      <Scatter />
    </>
  )

}

export default App;