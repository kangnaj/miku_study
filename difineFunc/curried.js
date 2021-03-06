/*
 * 2021-08-24 11:33:51
 * @create by: zj
 * @Description: 
 */
function curry(func) {
  return function curried(...args1) {
    let _this = this
    if (args1.length >= func.length) {
      func.apply(_this, args1)
    }else {
      return function (...args2) {
        return curried.apply(_this,[...args1, ...args2])
      }
    }
  }
}

let foo = function (a, b, c, d) {
  console.log(a+b+c+d);
}
const func = curry(foo)
func(1,2,3,4)

const add3 = function(...args) {
  const sum = (...args2) => add3.apply(null,[...args, ...args2]) 
  sum.getValue = () => args.reduce((pre, cur) => pre + cur)
  return sum
}