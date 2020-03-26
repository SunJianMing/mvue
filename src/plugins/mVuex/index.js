let Vue

// function observer(obj) {
//     if (typeof obj !== 'object' || obj === null) return;
//     Object.keys(obj).forEach(key => {
//         defineReactive(obj, key, obj[key])
//     })
// }

// function defineReactive(obj, key, val) {
//     Object.defineProperty(obj, key, {
//         get() {
//             console.log('get', val);

//             return val
//         },
//         set(newVal) {
//             if (newVal !== val) {
//                 console.log('set', key, newVal);
//                 val = newVal
//             }
//         }
//     })
// }

class Store {
    // constructor(options) {
    //     // 绑定state

    //     // Vue.util.defineReactive(this, 'state', options.state)
    //     this._mutations = options.mutations
    //     this._actions = options.actions

    //     this._wrapGetters = options.getters
    //     this.getters = {}
    //     let computed = {}
    //     let store = this
    //     Object.keys(this._wrapGetters).forEach(key => {
    //         let fn = store._wrapGetters[key]
    //         computed[key] = function () {
    //             return fn(store.state)
    //         }
    //         Object.defineProperty(this.getters, key, {
    //             get: () => {
    //                 return this._vm[key]
    //             }
    //         })
    //     })

    //     this._vm = new Vue({
    //         data: {
    //             $$state: options.state
    //         },
    //         computed
    //     })

    // }
    // get state() {
    //     return this._vm._data.$$state
    // }
    // set state(v) {
    //     console.error('error')
    // }
    constructor(options) {
        this._mutations = options.mutations
        this._actions = options.actions
        Vue.util.defineReactive(this, 'state', options.state)

        this._wrapGetters = options.getters
        this.getters = {}
        let computed = {}

        Object.keys(this._wrapGetters).forEach(key => {
            let fn = this._wrapGetters[key]
            computed[key] = () => {
                return fn(this.state)
            }
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return this._vm[key]
                }
            })

        })

        this._vm = new Vue({
            computed
        })
    }
    commit = (type, payload) => {
        let fn = this._mutations[type]
        fn && fn(this.state, payload)
    }
    dispatch = (type, payload) => {
        let fn = this._actions[type]
        fn && fn(this, payload)
    }
}

function install(_Vue) {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        },
    })

}

export default {
    install,
    Store
}