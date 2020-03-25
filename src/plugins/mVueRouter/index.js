import {
    install,
    Vue
} from './install'
class MVueRouter {
    constructor(options) {
        this.$options = options
        this.current = window.location.hash.slice(1)
        Vue.util.defineReactive(this, 'matched', [])
        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))
        this.match()

    }
    onHashChange() {
        this.current = window.location.hash.slice(1)
        this.matched = []
        this.match()
    }
    match(routes) {
        routes = routes || this.$options.routes
        for (let route of routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return
            }
            if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
                this.matched.push(route)
                if (route.children) {
                    this.match(route.children)
                }
                return
            }

        }

    }
}

MVueRouter.install = install
export default MVueRouter