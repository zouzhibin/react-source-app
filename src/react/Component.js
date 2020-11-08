import {isFunction} from './utils'
import {createDOM} from './react-dom'


// getDerviedStateFromProps 根据新的属性对象得到新的状态方法，
// 他是一个静态方法，只能通过类来调用，不能通过实例来调用

// getSnapshotBeforeUpdate 这个方法是在重新渲染之前触发的  可以获取到老的dom的状态
// 定义并导出一个变量中updateQueue
export let updateQueue = {
    updaters:[], // 更新器的数组，默认是一个空数组
    // 是否处于批量更新模式
    isBatchingUpdate:false,
    add(updater){
        this.updaters.push(updater)
    },
    // 先通过add方法添加updater 然后在合适的时候调用这个变量更新方法，一次性全部更新updater
    batchUpdate(){
        updateQueue.isBatchingUpdate = true
        // 把数组里的updaters全部取出 进行批量更新或者全量更新
        this.updaters.forEach(updater=>updater.updateComponent())
        this.updaters = 0
        this.isBatchingUpdate = false // 设置为非批量更新模式s
    }
}

class Updater{
     constructor(classInstance){
        this.classInstance = classInstance
        this.pendingStates = [] // 这是一个数组 用来缓存所有的状态
     }
     addState(partialState){
         // 先把分状态或者更新函数放在数组里进行缓存
        this.pendingStates.push(partialState)

        this.emitUpdate()
        // 判断当前是否处于批量更新模式(异步)，如果是的话则先添加到更新队列中去等待更新
        // 否则的话则处于非批量更新模式(同步)
        // updateQueue.isBatchingUpdate?updateQueue.add(this):this.updateComponent()
     }
     emitUpdate(nextProps){
        this.nextProps = nextProps
        if(this.classInstance.componentWillReceiveProps){
            this.classInstance.classInstancecomponentWillReceiveProps(nextProps)
        }
        // 如果传了新的属性过来，或者当前不是处于批量更新模式
        if(this.nextProps||!updateQueue.isBatchingUpdate){
            this.updateComponent()
        }else{
            updateQueue.add(this)
        }
     }
     // 让组件进行更新s
     updateComponent(){
        let {classInstance,pendingStates,nextProps} = this //updater 里的类组件实例和数组中的状态
        let {state} = classInstance
        if(nextProps||pendingStates.length>0){
            // 从pendingStates 中得到新的状态
            // classInstance.state = this.getState()
            // // 然后要重新渲染 进行更新
            // classInstance.forceUpdate()
            shouldUpdate(classInstance,nextProps,this.getState()) 
        }
     }
     getState(){
        let {classInstance,pendingStates} = this //updater 里的类组件实例和数组中的状态
        let {state} = classInstance
        if(pendingStates.length>0){
            let nextState = state
            pendingStates.forEach(partialState=>{
                if(isFunction(partialState)){
                    nextState = partialState(nextState)
                }else{
                    nextState = {...nextState,partialState}
                }
            })
            pendingStates.length = 0
            return nextState
        }
     }
 }
 function shouldUpdate(classInstance,nextProps,nextState) {
     // 不管要不要重新刷新组件，其实内部的状态和属性已经是最新的了
     classInstance.props = nextProps||classInstance.props
     classInstance.state = nextState||classInstance.state
     // 如果有shouldComponentUpdate方法 并且返回值是false
     if(classInstance.shouldComponentUpdate&&(!classInstance.shouldComponentUpdate(nextProps,nextState))){
        return 
     }else{
        // 如果没有shouldComponentUpdate方法 它返回值为true的话 则要更新
        classInstance.forceUpdate()
     }
 }
class Component{
    static isReactComponent = true
    constructor(props){
        this.props = props
        this.state = {}
        this.$updater = new Updater(this)
    }
    // 只放更新状态
    setState(partialState){
        this.$updater.addState(partialState)
    }
    // 让这个组件的状态改变后，更新render 得到新的虚拟dom，
    // 然后从新的虚拟dom得到新的真实DOM
    // 然后用新的真实dom替换老的真实dom就可以实现更新了
    forceUpdate(){
        

        if(this.componentWillUpdate){
            this.componentWillUpdate()
        }

        // // 获取老的虚拟dom
        // let oldVdom = this.oldVdom
        // // 重新render
        // let newVdom = this.render()
        // // 比较的时候还会比较元素本身和它的儿子们
        // let newDom = compare(oldVdom,newVdom)

        let newVdom = this.render()
        if(newVdom.type.getDerivedStateFromProps{
            let newState = newVdom.type.getDerivedStateFromProps(this.props,this.state)
            if(newState){ // 如果返回一个不为null的值，则赋值给state 如果返回为空 则什么都不做
                this.state = {...this.this.state,...newState}
            }
        }
        let extraArgs = this.getSnapshotBeforeUpdate&&this.getSnapshotBeforeUpdate()
        let newDom = createDOM(newVdom)
        let oldDom = this.dom
        oldDom.parentNode.replaceChild(newDom,oldDom)
        this.dom = newDom
        if(this.componentDidUpdate){
            this.componentDidUpdate(this.props,this.state,extraArgs)
        }
    }

}

export function compare(oldVdom,newVdom) {
    // 如果类型一样的要进行深度对比
    if(oldVdom.type === newVdom.type){
        // 可以复用老DOM 不需要新创建DOM了
        // 1、用新的属性对象更新老的DOM的属性
        // 2、深度比较儿子们，进行一一对比
    }
}


// 为了区分是普通函数 还是类函数
Component.prototype.isReactComponent = {}

export default Component