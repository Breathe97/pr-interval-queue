import { removeQueueItem, addQueueItem, startQueue } from './index.js'

const timeFormat = (dateTime = null, fmt = 'yyyy-mm-dd') => {
  if (!dateTime) return ''
  // 时间戳
  if (dateTime.length === 10 || dateTime.length === 13) {
    dateTime = Number(dateTime)
  }
  let date = new Date(dateTime)
  let ret
  let opt = {
    'y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

// 下面是模拟事件情况

startQueue(1000, true) // 一秒检查一次 开启调试
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
// 为整个系统添加一个凌晨偷偷 reload
const func_reload = () => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:`)
}
const now = new Date().getTime()
const now_str = timeFormat(now, 'yyyy/mm/dd 00:00:00') // 今天的时间 2023/07/07 00:00:00
const day_time = new Date(now_str).getTime()
const execution_time = day_time + 1000 * 60 * 60 * (day_time > now ? 4 : 4 + 24) // 今天凌晨4点
addQueueItem({ func: func_reload, interval: 1000 * 60 * 60 * 24, execution_time }) // 添加一个任务在未来的04:00执行,并且每24小时循环一次
