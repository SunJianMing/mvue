function readOnly(obj) {
    Object.keys(obj).forEach(key => {
        Object.defineProperty(obj, key, {
            value: obj[key],
            writable: false
        })
    })
}
var obj = {
    foo: 1
}
readOnly(obj, 'foo')
console.log(obj.foo);
obj.foo = 10
console.log(obj.foo);