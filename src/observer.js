function observer(obj) {
    if (typeof obj !== 'object' || obj == null) return;
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            return val
        },
        set(newVal) {
            if (val !== newVal) {
                val = newVal
                document.body.offsetHeight
            }
        }
    })
}

let obj = {
    bar: 1,
    a: 3
}