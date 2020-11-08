import React, { createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// let a = React.createElement("h1", {
//   className: "namw1"
// }, React.createElement("span", {
//   id: "sp"
// }, "ssss"));
// console.log(a)

class Count extends React.Component{
  constructor(prop){
    super(prop)
    this.a = createRef()
    // console.log(createRef())
    // console.log(<input ref={this.a }/>)
  }
  componentDidMount(){

  }
  handle=()=>{
    this.a.current.value=100
  }
  render(){
    return(
      <div>
        <button onClick={this.handle}></button>
        <input ref={this.a }/>
      </div>
    )
  }
}



ReactDOM.render(
  <Count/>,
  document.getElementById('root')
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
