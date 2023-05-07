'use strict';

const chain = () => {
    const dummy = () => {
    };
    const store = [];
    let count = 0;
    console.log('Start!');
    const map = () => chain;
    map.add = (...args) => (ms) => {
        const f_obj = {};
        f_obj.fn = args.shift();
        f_obj.callback = args.pop();
        f_obj.args = args;
        f_obj.ms = ms;
        f_obj.nx = dummy;
        f_obj.f_do = () => f_nx(f_obj.fn, f_obj.ms)(f_obj.nx)(...f_obj.args, (next, ...data) => {
            next();
            f_obj.callback(...data);
        });
        store.push(f_obj);
        count++;
        return map;
    };
    const f_nx = (fn, ms = 1) => nx => (...args) => {
        const callback = args.pop();
        const cb = () => callback(nx, null, ...args);
        setTimeout(() => cb(), ms);
    }
    map.do = () => {
        for (let i = 0, j = 1; i < store.length - 1; i++, j++) {
            store[i].nx = store[j].f_do;
        }
        store[store.length - 1].nx = dummy;
        const f_done = () => store[0].f_do();
        f_done();
        return map;
    };
    return map;
}

const foo = (x, callback) => callback(null, x);
const foo1 = (x, y, callback) => callback(null, x, y);
const foo2 = (x, y, z, callback) => callback(null, x, y, z);

const do_chain = chain();

do_chain
    .add(foo, 1, (err, x) => {
        if (err) throw new Error('error!');
        console.dir({x});
    })(1000)
    .add(foo1, 2, 3, (err, x, y) => {
        if (err) throw new Error('error from foo1!');
        console.dir({x, y});
    })(1000)
    .add(foo2, 5, 6, 7, (err, x, y, z) => {
        if (err) throw new Error('error from foo2!');
        console.dir({x, y, z});
    })(1000);


do_chain.do();









