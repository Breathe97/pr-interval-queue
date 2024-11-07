import { Queue } from './Queue'

interface QueueItem {
  /**
   * 事件唯一key 重复key会覆盖
   */
  key?: string

  /**
   * 执行时间（当现实时间达到该值时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
   */
  execution_time: number

  /**
   * 执行的间隔时间
   */
  interval?: number

  /**
   * 执行的函数
   */
  func: Function
}

interface QueueItem2 {
  /**
   * 事件唯一key 重复key会覆盖
   */
  key?: string

  /**
   * 执行时间（当现实时间达到该值时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
   */
  execution_time?: number

  /**
   * 执行的间隔时间
   */
  interval: number

  /**
   * 执行的函数
   */
  func: Function
}

let queue: {
  startQueue: Function
  removeQueueItem: Function
  addQueueItem: Function
}

/**
 * 启动计时器
 * @param _interval 计时器时间 ms 默认为 1000
 * @param _debug 是否开启调试模式 默认为 false
 */
export const startQueue = (_interval = 1000, _debug = false) => {
  queue = new Queue(_interval, _debug)
  queue.startQueue()
}

/**
 * 移除事件
 * @param keys 需要移除的事件
 */
export const removeQueueItem = (keys: string[] = []) => {
  if (queue) {
    queue.removeQueueItem(keys)
  }
}

/**
 * 添加事件
 * @param queueItem 单个事件信息
 * @returns 事件的key
 */
export const addQueueItem = (queueItem: QueueItem | QueueItem2) => {
  queue.addQueueItem(queueItem)
}
