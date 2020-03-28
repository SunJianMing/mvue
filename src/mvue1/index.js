class Mvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$el = options.el
        //绑定数据
        observe(this.$data)

        //数据代理
        proxy(this, '$data')

        //编译模版器
        new Complie(this.$el, this)
    }
}

class Dep {
    constructor() {
        this.watchers = []
    }
    addWatch(watch) {
        this.watchers.push(watch)
    }
}


class Watcher {
    constructor(vm, exp, updater) {
        this.vm = vm
        this.exp = exp
        this.updater = updater
        Dep.target = this
        this.vm[this.exp]
        Dep.target = null
    }
    update() {
        this.updater.call(this.vm, this.vm[this.exp])
    }
}

//编译模版器
class Complie {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        this.complie(this.$el)
    }
    complie(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                let attributes = node.attributes
                Array.from(attributes).forEach(attr => {
                    let attrName = attr.name
                    let exp = attr.value
                    if (this.isDir(attrName)) {
                        let dir = attrName.substr(2)
                        this[dir] && this[dir](node, exp)
                    }
                    if (this.isEvent(attrName)) {
                        let dir = attrName.substr(5)

                        this.addEventList(node, dir, exp)
                        // this[dir] && this[dir](node, exp)
                    }

                })
            }
            if (this.isInter(node)) {
                this.textCompile(node)
            }
            if (node.childNodes) {
                this.complie(node)
            }
        })
    }
    addEventList(node, event, exp) {

        node.addEventListener(event, () => {
            // console.log(exp);

            this.$vm.$options.methods[exp].apply(this.$vm)


            // this.$vm.method[exp]
        })
    }
    // 插值绑定
    textCompile(node) {
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
    isEvent(attr) {
        return attr.indexOf('m-on:') == 0
    }
    isDir(dir) {
        return dir.indexOf('m-') == 0
    }
    isElement(node) {
        return node.nodeType == 1
    }
    isInter(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    text(node, exp) {
        // node.textContent = this.$vm[exp]
        this.update(node, exp, 'text')
    }
    html(node, exp) {
        this.update(node, exp, 'html')
    }
    htmlUpdate(node, val) {
        node.innerHTML = val
    }

}

//数据代理
function proxy(vm, prop) {
    Object.keys(vm[prop]).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm[prop][key]
            },
            set(newVal) {
                vm[prop][key] = newVal
            }
        })
    })
}
//绑定数据
class Observe {
    constructor(value) {
        this.value = value
        this.wail(this.value)
    }
    wail(obj) {
        Object.keys(obj).forEach(key => {
            if (Array.isArray(obj)) {
                arrayProto(obj)
                Object.keys(obj).forEach(key => {
                    defineReactive(obj, key, obj[key])
                })
            } else {
                defineReactive(obj, key, obj[key])
            }

        })
    }
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) return;
    new Observe(obj)
}

function defineReactive(obj, key, val) {
    observe(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', key, val);
            Dep.target && dep.addWatch(Dep.target)
            return val
        },
        set(newVal) {
            if (val !== newVal) {
                console.log('set', key, newVal);
                val = newVal
                dep.watchers.forEach(w => w.update())
            }
        }
    })
}

function arrayProto(array) {
    const original = Array.prototype
    const arrayMethods = Object.create(original);
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
        arrayMethods[method] = function () {
            original[method].apply(this, arguments)
            console.log('数组', method, '操作');

        }
    })
    array.__proto__ = arrayMethods
}