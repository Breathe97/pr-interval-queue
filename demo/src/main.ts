import { removeQueueItem, addQueueItem, startQueue } from '../../src/index.js'
// import { removeQueueItem, addQueueItem, startQueue } from '../../dist/index.js'
// import { removeQueueItem, addQueueItem, startQueue } from 'pr-interval-queue'
import { timeFormat } from 'pr-tools'

startQueue(1000, true) // 一秒检查一次 开启调试

// 下面是模拟事件情况
let aaa = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行aaa`)
}
addQueueItem({ func: aaa, interval: 3000 })

removeQueueItem(['dddd']) // 移除一个不存在的时间

let bbb = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行bbb`)
}

let ccc = async () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:执行ccc`)
  await new Promise((a) => setTimeout(() => a(true), 3000))
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
// 为整个系统添加一个凌晨偷偷 reload
const func_reload = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:`)
}
const now = new Date().getTime()
const now_str = timeFormat(`${now}`, 'yyyy/mm/dd 00:00:00') // 今天的时间 2023/07/07 00:00:00
const day_time = new Date(now_str).getTime()
const execution_time = day_time + 1000 * 60 * 60 * (day_time > now ? 4 : 4 + 24) // 今天凌晨4点
addQueueItem({ func: func_reload, interval: 1000 * 60 * 60 * 24, execution_time }) // 添加一个任务在未来的04:00执行,并且每24小时循环一次
