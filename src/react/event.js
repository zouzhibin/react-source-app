import {updateQueue} from './Component'
/**
 * 绑定事件
 * 在React 不是直接绑定的 而是采用了一种合成事件的方式进行处理的
 * @param {*} dom 要绑定的事件的真实dom元素
 * @param {*} eventType onclick 绑定事件的类型
 * @param {*} listener 事件回调函数 handleClick
 */
export default function addEvent(dom,eventType,listener){
    // 在DOM元素会保存一个对象
    let store = dom.store || (dom.store = {})
    // button.store.onclick = listener
    store[eventType] = listener
    // document.addEventListener('on',事件处理函数，是否是冒泡阶段捕获)
    document.addEventListener(eventType.slice(2),dispatchEvent,false)


    
}
/**
 * 1、为了实现合成事件
 *  1、为了性能，快速  回收event对象
 *  2、为了兼容性屏蔽浏览器差异
 * @param {*} event 
 */
let syntheticEvent = {}
function dispatchEvent(event){
    let {target,type} = event; // taget button 的dom元素 type 是click
    let eventType = 'on'+type; // onclick
    let {store} = target // 看看事件源上有没有store
    let listener = store&&store[eventType]; // 
    if(listener){
        // 让合成事件的原生事件指向真实的事件对象
        syntheticEvent.nativeEvent = event
        for(let key in event){
            syntheticEvent[key] = event[key]
        }
        // 表示进入批量更新模式 不会直接更新
        updateQueue.isBatchingUpdate = true
        listener.call(target,syntheticEvent)
        // 退出批量更新模式 进入直接同步更新模式
        updateQueue.batchUpdate()// 在事件执行后进行批量更新
        // updateQueue.isBatchingUpdate = false
        for(let key in event){
            syntheticEvent[key] = null
        }
    }

}
