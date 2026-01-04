import { Queue } from '../../src/index.js'
// import { Queue } from '../../dist/index.js'
// import { Queue } from 'pr-interval-queue'

const queue = new Queue(1000, true) // 一秒检查一次 开启调试

queue.startQueue()

// 下面是模拟事件情况
let aaa = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行aaa`)
}
queue.addQueueItem({ func: aaa, interval: 10000 })

queue.removeQueueItem(['dddd']) // 移除一个不存在的任务

let bbb = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行bbb`)
}

let ccc = async () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行ccc`)
  await new Promise((a) => setTimeout(() => a(true), 3000))
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行了一个Promise之后的ccc`)
}

setTimeout(() => {
  queue.addQueueItem({ func: bbb, interval: 3000, key: 'bbb-3' })
  queue.addQueueItem({ func: bbb, interval: 4000, key: 'bbb-4' })
  queue.addQueueItem({ func: bbb, interval: 5000, key: 'bbb-5' })
}, 4000)

setTimeout(() => {
  queue.addQueueItem({ func: ccc, interval: 6000, key: 'ccc-6' })
  queue.addQueueItem({ func: ccc, interval: 7000, key: 'ccc-7' })
  queue.addQueueItem({ func: ccc, interval: 8000, key: 'ccc-8' })
  queue.addQueueItem({ func: ccc, interval: 8000, key: 'bbb-5' })
}, 10000)

// 指定时间戳执行一次
const func = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:指定时间戳执行一次`)
}
const now = new Date().getTime()

queue.addQueueItem({ key: '指定时间', func, interval: 0, execution_time: now + 1000 * 60 })
