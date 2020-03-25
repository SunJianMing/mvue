let Vue

function observer(obj) {
    if (typeof obj !== 'object' || obj == null) return;
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            return val
        },
        set(newVal) {
            if (val !== newVal) {
                val = newVal
                document.body.offsetHeight
            }
        }
    })
}
class Store {
    constructor(options) {
        this.state = options.state
        observer(options.state)
        // Vue.util.defineReactive(this, 'state', options.state)
        console.log(this);

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