import addEvent from './event'
// import ClassComponent from '.'
/**
 * 把虚拟vdom转成真实的DOM并且插入到parentDom里面
 * @param {*} vdom 虚拟DOM React元素 也就是一个JS对象
 * @param {*} parentDom 真实的DOM
 */
function render(vdom,parentDom){
    let dom = createDOM(vdom)
    parentDom.appendChild(dom)

}
/**
 * 把props属性赋值给真实DOM元素
 * @param {b} dom 
 * @param {*} props 
 */
function updateProps(dom,props){
    for(let key in props){
        if(key==='children'){
            continue
        }
        if(key==='style'){
            let style = props[key]
            for(let attr in props[key]){
                vdom.style[attr] = style[attr]
            }
        }else if(key.startsWith('on')){
            // dom = button  onclick handleClick
            addEvent(dom,key.toLocaleLowerCase(),props[key])
        }else{
            vdom[key] = props[key]
        }
    }
}
/**
 * 把一个虚拟dom转换成真实dom并插入到页面中去
 * @param {*} vdom 
 */
export function createDOM(vdom){
    if(typeof vdom ==='string'||typeof vdom==='number'){
        return document.createTextNode(vdom)
    }
    let {type,props,ref} = vdom
    let dom;
    if(typeof type==='function'){
        return type.prototype.isReactComponent?updataClassComponent(vdom): updataFunctionComponent(vdom)
    }else{ // 如果说类型是一个普通的字符串，说明是一个原生的虚拟DOM节点比如说h1 span div
        dom = document.createElement(type) // 创建真实的DOM元素
    }
    updateProps(dom,props)
    if(typeof props.children==='string'||typeof props.children==='number'){
        dom.textContent = props.children // 
      // 如果儿子是一个对象（虚拟DOM）并且不是数组  
    }else if(typeof props.children==='object'&&props.children.type){
        render(props.children,dom)
    }else if(Array.isArray(props.children)){ // 是数组的话
        reconcileChildren(props.children,dom)
    }else{
        dom.textContent = props.children? props.children.toString():""// 
    }
    if(ref){
        ref.current = dom;
    }
    return dom
    
}
/**
 * 更新函数组件
 * @param {*} virtualDOM 
 */
function updataFunctionComponent(virtualDOM){
    let {type,props} = virtualDOM;

    let renderVirtualDOM = type(props)
    let dom = createDOM(renderVirtualDOM)
    
    return dom
}
/**
 * 更新类组件
 * @param {*} children 
 * @param {*} parentDom 
 */

function updataClassComponent(virtualDOM){
    let {type:ClassComponent,props,ref} = virtualDOM;
    let classInstance =new ClassComponent(props)
    if(classInstance.componentWillMount){
        classInstance.componentWillMount() // 在挂载前调用一下componentWillMount
    }
    if(ref){ // 如果类组件的虚拟dom 有ref 属性 那么就让ref,current = 类组件的实例
        ref.current = classInstance
    }
    let renderVirtualDOM = classInstance.render()

    classInstance.oldVdom = renderVirtualDOM
    // 在类的实例身上挂一个属性dom,指向此类实例对应的真实dom
    let dom = createDOM(renderVirtualDOM)
    classInstance.dom = dom
    if(classInstance.componentDIdMount){
        classInstance.componentDIdMount() // 在挂载前调用一下componentWillMount
    }
    return dom
}

/**
 * 处理儿子
 * @param {} children 
 * @param {*} dom 
 */
function reconcileChildren(children,parentDom){
    // 把每个儿子都从虚拟dom变成真实dom并且插入到父节点去
    for(let i =0;i<children.length;i++){
        render(children[i],parentDom)
    }
}

export default render