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
    constructor(options) {
        // 绑定state

        Vue.util.defineReactive(this, 'state', options.state)
        this._mutations = options.mutations
        this._actions = options.actions
        this._wrapGetters = options.getters
        Vue.util.defineReactive(this, 'getters', {
            get() {
                return 'a'
            }
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