import Link from './component/Link'
import View from './component/View'
export let Vue
export function install(_Vue) {
    //如果当前组件已经注册过，则返回
    if (install.installed && _Vue === Vue) return
    install.installed = true
    Vue = _Vue
    // 判断当前是不是undefine
    const isDef = v => v !== undefined
    Vue.mixin({
        beforeCreate() {
            if (isDef(this.$options.router)) {
                Vue.prototype.$router = this.$options.router
            }
        },
    })

    Vue.component('router-link', Link)
    Vue.component('router-view', View)
}