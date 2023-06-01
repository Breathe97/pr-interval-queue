import { removeQueueItem, addQueueItem, startQueue } from './index.js'

// 下面是模拟事件情况

startQueue(1000, true) // 一秒检查一次 开启调试
let aaa = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行aaa`)
}
addQueueItem({ func: aaa, interval: 10000 })

let bbb = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行bbb`)
}

let ccc = async () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行ccc`)
  await new Promise((a, b) => setTimeout(() => a(true), 3000))
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行了一个Promise之后的ccc`)
}

setTimeout(() => {
  addQueueItem({ func: bbb, interval: 3000, key: 'bbb-3' })
  addQueueItem({ func: bbb, interval: 4000, key: 'bbb-4' })
  addQueueItem({ func: bbb, interval: 5000, key: 'bbb-5' })
}, 4000)

setTimeout(() => {
  addQueueItem({ func: ccc, interval: 6000, key: 'ccc-6' })
  addQueueItem({ func: ccc, interval: 7000, key: 'ccc-7' })
  addQueueItem({ func: ccc, interval: 8000, key: 'ccc-8' })
  addQueueItem({ func: ccc, interval: 8000, key: 'bbb-5' })
}, 10000)
