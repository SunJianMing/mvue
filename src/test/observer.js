class Observe {
    constructor(obj) {
        this.init(obj)

    }
    init(obj) {
        if (obj == null || typeof obj !== 'object') return
        if (Array.isArray(obj)) {
            new arrayMethods(obj)
            Object.keys(obj).forEach(key => {

                this.defineReactive(obj, key, obj[key])

            })
        } else {
            Object.keys(obj).forEach(key => {
                this.defineReactive(obj, key, obj[key])
            })
        }

    }
    defineReactive(obj, key, val) {
        this.init(val)
        Object.defineProperty(obj, key, {
            get: () => {
                console.log('get', val);
                return val
            },
            set: (newVal) => {
                if (newVal !== val) {
                    console.log('set', key, newVal);
                    val = newVal
                    this.init(newVal)

                }
            }
        })
    }
    static $set(obj, key, val) {
        new Observe().defineReactive(obj, key, val)

    }
}


class arrayMethods {
    constructor(options) {
        const arrayProto = Array.prototype
        const arrayMethods = Object.create(arrayProto)
        let methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

        methodsToPatch.forEach(method => {
            let original = arrayMethods[method]
            this.def(arrayMethods, method, function muation(...args) {
                let result = original.apply(this, args)
                console.log('array方法', method);
                return result
            })

        })
        options.__proto__ = arrayMethods

    }
    def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            configurable: true,
            writable: true
        })
    }
}