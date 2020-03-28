function def(obj, key, val, enumerable) {
    // console.log(val);
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = ['push', 'pop', 'unshift', 'shift', 'sort', 'reverse']

methodsToPatch.forEach(function (method) {
    let original = arrayProto[method]

    def(arrayMethods, method, function mutator(...args) {
        let result = original.apply(this, args)
        console.log('数组');

        return result
    })

})
let arr = []
// console.log(arr.prototype);

// console.log(arr.__proto__);

// arr.prototype = arrayMethods
// console.log(arr.__proto__);

arr.push(0)