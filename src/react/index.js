
import render from './react-dom'
function createElement(type,config,children){
    let ref;
    if(config){
        ref = config.ref
    }
    let props = {...config}
    if(arguments.length>3){
        children = Array.prototype.splice.call(arguments,2)
    }
    props.children = children
    return {
        type,
        props,
        ref
    }
}

function createRef() {
    return {
        current:null
    }
}

function forwardRef(FunctionComponent) {
    return class extends Comment{
        render(){
            return FunctionComponent(this.props,this.props.ref)
        }
    }
}
export default {
    createElement,
    render,
    createRef,
    forwardRef
    
}