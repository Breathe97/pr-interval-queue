# 一个简单的全局事件循环队列

## 使用方法

```bash
npm i pr-interval-queue
```

#### 按需引入

```js
import { removeQueueItem, addQueueItem, startQueue } from 'pr-interval-queue'
```

#### main.js 中开启队列

```js
startQueue(1000, true) // 循环频率ms，是否开启调试
```

#### 简单使用

```js
// 需要执行的函数
const func = () => {}
// 添加一个事件10000ms执行一次
addQueueItem({ func, interval: 10000 })
```

#### 指定事件 key

```js
// 需要执行的函数
const func = () => {}

// 指定事件key (重复添加相同事件会清除上一个)
addQueueItem({ func, interval: 3000, key: 'bbb-3' })
```

#### 在未来添加一个事件不循环

```js
// 需要执行的函数
const func = () => {}

addQueueItem({ func, interval: 0, key: 'ccc-6', execution_time: new Date().getTime() + 1000 * 60 * 60 * 24 * 1 })
```

#### 移除事件

```js
// 需要执行的函数
const func = () => {}

// 保存添加后的key 如果不指定key，会随机生成一个并返回
const key = addQueueItem({ func, interval: 3000 })
removeQueueItem([key])
```

## 代码仓库

[github](https://github.com/breathe97/pr-interval-queue)

## 贡献

breathe
