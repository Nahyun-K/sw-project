import "./App.css";
import BarSek from "./BarSek.js";
// import BarSek from "./Change";
import Bar from "./Bar.js";
import React, { useState } from "react";
import AgeChart from "./AgeSek";
import Scatter from "./scatter";
import Prac4 from "./Prac4";

function App() {

  const [count, setCount] = useState(1);

  return( 
    <>
      <h1 id="TitleMonth"><span id="count">{count}</span>월</h1>
      <div id="listCenter">
        <div id="btnList">
          <button className="custom-btn btn-10" onClick={() => setCount(1)}><span>1월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(2)}><span>2월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(3)}><span>3월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(4)}><span>4월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(5)}><span>5월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(6)}><span>6월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(7)}><span>7월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(8)}><span>8월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(9)}><span>9월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(10)}><span>10월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(11)}><span>11월</span></button>
          <button className="custom-btn btn-10" onClick={() => setCount(12)}><span>12월</span></button>
        </div>
      </div>
      <div id="barList">
        <div>
          <div id="top3bar">
            <h3 id="graphTitle">Top3 따릉이 대여소의 시간대별 이용분석</h3><br/>
            <div className="Bar"><Prac4 count={count}/> </div>
          </div>
          <div id="month_fix">
            <h3 id="graphTitle">월별 따릉이 고장부품 개수</h3><br/>
            <div className="BarS"><BarSek month={count}/></div>
          </div> 
        </div>
        <div>
          <div id="month_new">
              <h3 id="graphTitle">월별 신규가입자 분석</h3><br/>
              <div className="Bar"><Bar month={count}/></div>
            </div>
            <div id="age_user">
              <h3 id="graphTitle">연령대별 이용자수 분석</h3><br/>
              <div className="Bar"><AgeChart month={count}/></div>
            </div>
          </div>
        <h3 id="graphTitle">구별 인구수 대비 대여소개수</h3><br/>
        <div className="Bar"><Scatter/></div>
        
        <button id="map-seoul"><a id="map-seoul-a" href= "https://buildthan.github.io/map_test/seoulmap.html"><h3 id="graphTitle">21년도 구별 Top3 대여소 &gt;&gt;</h3></a></button>
      </div>
    </>
  )

}

export default App;