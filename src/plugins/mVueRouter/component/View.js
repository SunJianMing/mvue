export default {
    render(h) {

        this.$vnode.data.routerView = true
        let depth = 0
        let parent = this.$parent

        while (parent) {
            let vnodeData = parent.$vnode && parent.$vnode.data

            if (vnodeData) {
                if (vnodeData.routerView) {
                    depth++
                }
            }
            parent = parent.$parent
        }

        let component = null




        let route = this.$router.matched[depth]
        if (route) {
            component = route.component;
        }


        return h(component)
    }
}