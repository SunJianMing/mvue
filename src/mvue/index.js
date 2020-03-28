class Mvue {
    constructor(options) {
        this.$options = options
        this.$el = options.el
        this.$data = options.data
        //1绑定数据
        observe(this.$data)
        //1.1数据代理
        proxy(this, '$data')

        //2编译模版
        new Compile(this.$el, this)
    }
}
class Dep {
    constructor() {
        this.watchers = []
    }
    addDep(watcher) {
        this.watchers.push(watcher)
    }
    notify() {
        this.watchers.forEach(w => w.update())
    }
}


class Watcher {
    constructor(vm, key, updater) {
        this.vm = vm
        this.key = key
        this.updater = updater
        Dep.target = this
        this.vm[this.key]
        Dep.target = null
    }
    update() {
        this.updater.call(this.vm, this.vm[this.key])
    }

}

class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        this.compile(this.$el)
    }
    compile(el) {

        let childNodes = el.childNodes

        Array.from(childNodes).forEach(node => {

            if (this.isElement(node)) {
                this.compileElement(node)

            }
            if (this.isInter(node)) {
                this.compileText(node)
            }
            if (node.childNodes) {
                this.compile(node)
            }

        })
    }
    isElement(node) {
        return node.nodeType == 1
    }
    isInter(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    compileElement(node) {
        let attributes = node.attributes
        Array.from(attributes).forEach(attr => {
            let attrName = attr.name
            let exp = attr.value
            if (this.isDir(attrName)) {
                let dir = attrName.slice(2)
                this[dir] && this[dir](node, exp)
                node.removeAttribute('m-' + dir)

            }
            if (this.isEvent(attrName)) {


                let dir = attrName.slice(this.isEvent(attrName))

                this.addEventList(node, dir, exp)

            }
        })

    }
    isDir(dir) {
        return dir.indexOf('m-') == 0
    }
    isEvent(event) {
        if (event.indexOf('@') == 0) {
            return 1
        }
        if (event.indexOf('m-on') == 0) {
            return 2
        }
        return false
    }
    compileText(node) {
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }
    update(node, exp, dir) {
        let fn = this[dir + 'Update']
        fn && fn(node, this.$vm[exp])
        new Watcher(this.$vm, exp, function (val) {
            fn && fn(node, val)
        })
    }
    textUpdate(node, val) {
        node.textContent = val
    }
    text(node, exp) {
        this.update(node, exp, 'text')
        // node.textContent = this.$vm[exp]
    }
    addEventList(node, dir, eventName, flag) {
        console.log(eventName);

        const fn = this.$vm.$options.methods && this.$vm.$options.methods[eventName]


        node.addEventListener(dir, fn.bind(this.$vm), !!flag)



    }
}