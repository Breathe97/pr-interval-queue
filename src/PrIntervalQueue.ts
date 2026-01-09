import { uuid, timeFormat } from 'pr-tools'

interface QueueItem {
  /**
   * 事件唯一key 重复key会覆盖
   */
  key: string

  /**
   * 执行时间（当现实时间达到该值时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
   */
  execution_time: number

  /**
   * 执行的间隔时间
   */
  interval: number

  /**
   * 执行的函数
   */
  func: Function
}

export class PrIntervalQueue {
  #debug = false // 是否开启调试
  #queue: QueueItem[] = [] // 事件队列 执行安装从右往左执行，右侧事件执行完成时候会删除 然后插入到左侧重新等待下一次执行
  #interval = 1000 // 循环时间
  #now = Date.now() // 当前时间

  /**
   *
   * @param _interval 计时器时间 ms 默认为 1000
   * @param _debug 是否开启调试模式 默认为 false
   */
  constructor(_interval = 1000, _debug = false) {
    this.#interval = _interval
    this.#debug = _debug
  }

  /**
   * 移除事件
   * @param keys 需要移除的事件
   */
  removeQueueItem = (keys: string[] = []) => {
    // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:keys`, keys)
    for (const key of keys) {
      const index = this.#queue.findIndex((item) => item.key === key)
      if (index !== -1) {
        this.#queue.splice(index, 1)
        if (this.#debug) {
          console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:移除事件`, key)
        }
      }
    }
  }

  /**
   * 添加事件
   * @param queueItem 单个事件信息
   * @returns 事件的key
   */
  addQueueItem = (queueItem: Partial<QueueItem> & { func: Function }) => {
    const { key = uuid(), execution_time: _execution_time = this.#now, interval = 10000, func = () => {} } = queueItem

    this.removeQueueItem([key]) // 尝试删除可能存在的任务

    // 生成新的执行时间
    const execution_time = _execution_time + Number(interval)

    // 根据 execution_time 把info插入到队列
    let index = this.#queue.findIndex((item) => execution_time >= item.execution_time) // 查找比当前大的时间点
    index = index === -1 ? this.#queue.length : index // 如果是-1 表示没有比他小的 此时插入到最右侧在时间线最前面
    const newQueueItem = { key, execution_time, interval, func }
    this.#queue.splice(index, 0, newQueueItem) // 插入到数组中

    if (this.#debug) {
      console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:插入事件`, key, `执行时间: ${timeFormat(execution_time)}`, `队列位置: ${index}`)
    }
    return key
  }

  // 检查队列是否有需要执行的任务
  #checkQueue = () => {
    this.#now = Date.now() // 当前时间
    const length = this.#queue.length
    for (let i = length; i > 0; i--) {
      const nextQueueItem = this.#queue[this.#queue.length - 1]
      const { key, interval = 0, execution_time = 0, func } = nextQueueItem

      const surplus = Math.round((execution_time - this.#now) / 1000)

      if (!nextQueueItem) {
        if (this.#debug) {
          console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:`, `当前 无 任务`)
        }
        break
      }

      // 如果队列中有最近的任务
      if (this.#debug) {
        const _arr = Array.from(this.#queue, (item) => item.execution_time)
        const _arr2 = Array.from(this.#queue, (item) => item.execution_time).sort((a, b) => b - a)
        const _arr3 = Array.from(this.#queue, (item) => item.key)
        console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:队列keys`, JSON.stringify(_arr3))
        const isErr = JSON.stringify(_arr) !== JSON.stringify(_arr2)
        if (isErr) {
          console.error('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:时间线${_arr.length}`, '异常', JSON.stringify(_arr))
        }
        console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:`, `当前 有 任务`, `最近任务 ${timeFormat(execution_time)} 剩余${surplus}s`, `任务详情：${JSON.stringify(nextQueueItem)}`)
      }

      // 执行事件距离当前时间大于间隔时间时表示 没有可执行的队列 直接跳出循环
      if (surplus > 0) break

      // 需要执行当前事件
      func()
      // 如果 interval 为0 表示只执行一次 直接清除
      if (interval === 0) {
        return this.removeQueueItem([key])
      }
      // 重新添加新的任务
      this.addQueueItem(nextQueueItem)
    }
  }

  /**
   * 开启轮询队列监听
   * @param interval 循环检测周期 ms
   * @param _debug 是否开始调试
   * @returns 创建时的计时器序列
   */
  startQueue = () => {
    const timer = setInterval(this.#checkQueue, this.#interval)
    return timer
  }
}
