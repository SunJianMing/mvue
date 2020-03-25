import Vue from 'vue'
import MVourerRouter from '../plugins/mVueRouter'
import Home from '../views/Home.vue'
Vue.use(MVourerRouter)



const routes = [{
    path: '/',
    name: "Home",
    component: Home
}, {
    path: '/about',
    name: "About",
    component: () => import('../views/About.vue'),
    children: [{
        path: '/hello',
        component: {
            render(h) {
                return h('h1', 'hello')
            }
        }
    }]
}]

export default new MVourerRouter({
    routes
})