
import React, { createRef, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const ForwardedTextInput = React.forwardRef((props,ref)=>{
  return <input ref={ref}/>
})

class Count extends React.Component{
  static defaultProps = {     // 初始化默认属性对象
      name:'zzf'            
  }
  constructor(prop){
    super(prop)
    this.input = createRef()
  }
  componentDidMount(){
    console.log('this==',this.a)
  }
  handle=()=>{
    this.input.current.focus()
  }
  render(){
    return(
      <div>
        <button onClick={this.handle}>获得焦点</button>
        <ForwardedTextInput ref={this.input}></ForwardedTextInput>
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
