/*
 * 2021-08-06 11:58:54
 * @create by: zj
 * @Description: 
 */
// >>>0  无符号位移   第一个操作数向右移动指定的位数。向右被移出的位被丢弃，左侧用0填充。
// 1 . 如果不能转换为Number，那就为0
// 2 . 如果为非整数，先转换为整数，

function func() {
  const miku = "miku"

  function func2() {
    let yui = "yui"

    function func3() {
      var mio = "mio"
      console.log(miku);
    }
    return func3
  }
  return func2
}
// func()()()

function bubbleSort(arr) {
  const n = arr.length;
  let flag = true
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      if (arr[j] > arr[j + 1]) {
        flag = false[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    if (flag) {
      break
    }
  }
  return arr
}


function selectSort(arr) {
  const n = arr.length
  let minI
  for (let i = 0; i < n - 1; i++) {
    minI = i
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[i]) {
        minI = j
      }
    }
    [arr[i], arr[minI]] = [arr[minI], arr[i]]
  }
  return arr
}

function insertSort(arr) {
  const n = arr.length
  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
      j--
    }
  }
  return arr
}


function mergeSort(arr) {
  const merge = function (left, right) {
    const ln = left.length,
      rn = right.length,
      res = []
    let lp = 0,
      rp = 0
    while (lp < ln && rp < rn) {
      if (left[lp] <= right[rp]) {
        res.push(left[lp])
        lp++
      }else {
        res.push(right[rp])
        rp++
      }
    }
    while (lp < ln) {
      res.push(left[lp])
      lp++
    }
    while (rp < rn) {
      res.push(right[rp])
      rp++
    }
    return res
  }
  const n = arr.length
  if (n < 2) {
    return arr
  }
  const mid = n >> 1,
    left = arr.slice(0, mid),
    right = arr.slice(mid)
  return merge(mergeSort(left), mergeSort(right))
}

function quickSort (arr) {
  const n = arr.length
  const quick = function (left, right) {
    
  }
}
console.log(mergeSort([1, 3, 2, 5, 6, 4]));