class Mvue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$el = options.el

        //绑定数据
        observe(this.$data)
        proxy(this, '$data')

        //编译模版器
        new Compile(this.$el, this)
    }
}
class Dep {
    constructor() {
        this.deps = []
    }
    addDep(watch) {
        this.deps.push(watch)
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
//编译模版器
class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        this.$vm = vm
        this.compile(this.$el)
    }
    //循环遍历元素
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                // console.log('元素', node);
                let attrs = node.attributes
                // console.log(typeof attrs);
                Array.from(attrs).forEach(attr => {
                    let attrName = attr.name
                    let exp = attr.value
                    if (this.isDir(attrName)) {
                        let dir = attrName.substr(2)
                        this[dir] && this[dir](node, exp)
                    }
                    if (this.isEvent(attrName)) {
                        let dir = attrName.substr(1)
                        this.addEventList(node, dir, exp)
                    }
                })

            }
            if (this.isInter(node)) {
                // console.log('字节', node);
                this.textCompile(node)
            }
            if (node.childNodes) {
                this.compile(node)
            }
        })
    }
    //m-html
    html(node, exp) {
        this.update(node, exp, 'html')
    }
    htmlUpdate(node, val) {
        node.innerHTML = val
    }
    //m-mode
    mode(node, exp) {
        this.update(node, exp, 'mode')
        let self = this.$vm
        node.addEventListener('input', function (e) {
            self[exp] = e.target.value
        })
    }
    modeUpdate(node, val) {
        node.value = val

    }
    //更新函数
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
    // 事件绑定
    addEventList(node, dir, exp) {
        let fn = this.$vm.$options.methods && this.$vm.$options.methods[exp]
        // console.log(fn);
        node.addEventListener(dir, fn.bind(this.$vm))
    }
    //m-text
    text(node, exp) {
        // node.textContent = this.$vm[exp]
        this.update(node, exp, 'text')
    }
    // 判断是否为指令
    isDir(dir) {
        return dir.indexOf('m-') === 0
    }
    //判断是否为事件
    isEvent(dir) {
        return dir.indexOf('@') === 0
    }
    // 编译插值
    textCompile(node) {
        // node.textContent = this.$vm[RegExp.$1]
        this.update(node, RegExp.$1, 'text')
    }
    //判断是否是元素类型
    isElement(node) {
        return node.nodeType === 1
    }
    //  判断是否为插值
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}


// 数据代理
function proxy(vm, prop) {
    Object.keys(vm[prop]).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm[prop][key]
            },
            set(newVal) {
                if (newVal !== vm[prop][key]) {
                    vm[prop][key] = newVal
                }
            }
        })
    })
}

// 绑定数据
class Observe {
    constructor(value) {
        this.value = value
        this.waik(this.value)
    }
    waik(obj) {
        if (Array.isArray(obj)) {
            attayProto(obj)
        } else {
            Object.keys(obj).forEach(key => {
                defineReactive(obj, key, obj[key])
            })
        }
    }
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) return
    new Observe(obj)
}

function defineReactive(obj, key, val) {
    observe(val)
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', key, val);
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set', key, val);
                val = newVal
                dep.deps.forEach(w => w.update())
            }
        }
    })
}

function attayProto(array) {
    let original = Array.prototype
    let arrayMethods = Object.create(original);
    ['pop', 'push', 'sort', 'reverse', 'unshift', 'shift', 'splice'].forEach(method => {
        arrayMethods[method] = function () {
            original[method].apply(this, arguments)
            console.log('数组操作', method);

        }
    })
    array.__proto__ = arrayMethods
    for (let i = 0; i < array.length; i++) {
        observe(array[i])
    }
}