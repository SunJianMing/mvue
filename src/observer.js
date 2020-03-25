function observer(obj) {
    if (typeof obj !== 'object' || obj == null) return;
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', val);

            return val
        },
        set(newVal) {
            if (val !== newVal) {
                console.log('set', newVal);

                val = newVal

            }
        }
    })
}

let obj = {
    bar: 1,
    a: 3
}
observer(obj)
obj.bar
obj.bar = 10