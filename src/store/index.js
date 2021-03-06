import Vue from 'vue'
import Mvuex from '../plugins/mVuex'


Vue.use(Mvuex)

const store = new Mvuex.Store({
    state: {
        count: 1
    },
    mutations: {
        add(state) {
            state.count++
        }
    },
    actions: {
        asyncAdd({
            commit
        }) {
            setTimeout(() => {
                commit('add')
            }, 1000);
        }
    },
    getters: {
        dobCount(state) {
            return state.count * 4
        }
    }
})
export default store