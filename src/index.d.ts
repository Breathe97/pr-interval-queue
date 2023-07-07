interface FunInfo {
  func: Function // 执行的函数
  interval: number // 执行的间隔时间
  key?: string // 事件唯一key 清除时使用
  execution_time?: number // 激活时间（当现实时间达到该值附近时就会执行,如果设置一个未来时间 就会在未来这个时间再次激活轮询）
}

declare function uuid(len?: number, radix?: number): string

declare function removeQueueItem(keys: string[]): void

declare function addQueueItem(funInfo: FunInfo, clear?: boolean): number

declare function startQueue(interval?: number, debug?: boolean): number

export { uuid, removeQueueItem, addQueueItem, startQueue }
