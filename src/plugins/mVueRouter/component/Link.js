export default {
    props: {
        to: {
            type: String,
            default: ''
        },
        tag: {
            type: String,
            default: 'a'
        }
    },
    render(h) {
        if (this.tag == 'a') {
            return h(this.tag, {
                attrs: {
                    href: '#' + this.to
                }
            }, [this.$slots.default])
        } else {
            let children = []
            children.push(h('a', {
                attrs: {
                    href: '#' + this.to
                }
            }, [this.$slots.default]))
            return h(this.tag, children)
        }
    }
}