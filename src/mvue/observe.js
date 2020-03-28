function observe(obj) {
    if (typeof obj !== 'object' || obj == null) return
    if (Array.isArray(obj)) {
        arrayMethods(obj)
    } else {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}

function defineReactive(obj, key, val) {
    observe(val)
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val);
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (val !== newVal) {
                console.log('set', key, val);
                val = newVal
                dep.notify()
                // watchers.forEach(w => w.update())
            }
        }
    })
}

function arrayMethods(array) {
    let arrayproto = Array.prototype
    let arraymethods = Object.create(arrayproto)
    let methodsArray = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice']
    methodsArray.forEach(method => {
        arraymethods[method] = function () {
            arrayproto[method].apply(this, arguments)
            console.log('数组执行', method);
        }
    })
    array.__proto__ = arraymethods
    Object.keys(array).forEach(key => {
        defineReactive(array, key, array[key])
    })
}

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