interface QueueItem {
  func: Function // 执行的函数
  interval: number // 执行的间隔时间
  // key?: string // 事件唯一key 清除时使用
  // execution_time?: number // 激活时间（当现实时间达到该值附近时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
}

interface InsideQueueItem extends QueueItem {
  key: string // 事件唯一key 清除时使用
  execution_time: number // 激活时间（当现实时间达到该值附近时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
}

export interface OutsideQueueItem extends QueueItem {
  key?: string // 事件唯一key 清除时使用
  execution_time?: number // 激活时间（当现实时间达到该值附近时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
}

// 时间线 从左往右 越来越小,例如： <---------------------执行3---<---执行2---<---执行1-----当前时间
const queue: InsideQueueItem[] = [] // 事件队列 执行安装从右往左执行，右侧事件执行完成时候会删除 然后插入到左侧重新等待下一次执行
let debug = false

// 随机生成uuid
const uuid = (len = 16, radix = 16) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

// 移除事件
export const removeQueueItem = (keys: string[] = []) => {
  // 兼容单个字符串
  if (typeof keys === 'string') {
    keys = [keys]
  }
  // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:keys`, keys)
  for (const key of keys) {
    let index = queue.findIndex((item) => item.key === key)
    if (index !== -1) {
      queue.splice(index, 1)
      if (debug) {
        console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:移除事件`, key)
      }
    }
  }
}

// 添加事件
export const addQueueItem = (queueItem: OutsideQueueItem, clear = true) => {
  let { interval = 10000, key, func = () => {}, execution_time = 0 } = queueItem || {}
  // 通过time生成执行时间
  if (!execution_time) {
    execution_time = new Date().getTime() + Number(interval)
  }
  if (!key) {
    key = `${execution_time}-${uuid(4, 16)}`
  }
  // 主要为了 循环调用的时候不清除 因为直接获取到当前index 在内部清理 不需要查询
  if (clear) {
    // 如果key已经存在则先清除存在的事件对象
    const hasKey = queue.find((item) => item.key === key)
    if (hasKey) {
      // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:removeQueueItem`, key)
      removeQueueItem([key])
    }
  }
  // 根据execution_time 把info插入到队列

  let index = queue.findIndex((item) => execution_time >= item.execution_time) // 查找比当前大的时间点
  index = index === -1 ? queue.length : index // 如果是-1 表示没有比他小的 此时插入到最右侧在时间线最前面
  const info = { key, execution_time, interval, func }
  queue.splice(index, 0, info) // 插入到数组中
  if (debug) {
    console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:插入事件`, key, execution_time, index)
    let _arr = Array.from(queue, (item) => item.execution_time)
    let _arr2 = Array.from(queue, (item) => item.execution_time).sort((a, b) => b - a)
    let _arr3 = Array.from(queue, (item) => item.key)
    console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:队列keys`, JSON.stringify(_arr3))
    console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:时间线${_arr.length}`, JSON.stringify(_arr) === JSON.stringify(_arr2) ? '正常' : '异常', JSON.stringify(_arr))
    console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:---------------------------------`)
  }
  return key
}

// 开启轮询队列监听
export const startQueue = (interval = 1000, _debug = false) => {
  debug = _debug // 是否开启调试
  const timer = setInterval(() => {
    const now = new Date().getTime() // 当前时间
    let length = queue.length
    for (let i = length; i > 0; i--) {
      const info = queue[i - 1]
      const { interval, execution_time = 0, func, key } = info
      // 执行事件距离当前时间大于间隔时间时表示 没有可执行的队列 直接跳出循环
      const isBreak = execution_time - now > 0
      if (debug) {
        console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:队列循环`, isBreak, (execution_time - now) / 1000, JSON.stringify(info))
      }
      if (isBreak) break
      // 需要执行当前事件
      func()
      // 执行完了之后 把当前事件移动到队列最左侧
      queue.splice(i - 1, 1)
      const funInfo = { interval, key, func }
      addQueueItem(funInfo, false)
    }
  }, interval)
  return timer
}
