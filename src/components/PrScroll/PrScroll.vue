<script setup lang="ts">
import { ref, watch, nextTick, computed, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
const props = defineProps({
  list: {
    type: [Array],
    default: () => [],
  },
  // 每次滚动间隔时间
  interval: {
    type: [Number],
    default: () => 8,
  },
  // 每次滚动间隔距离
  gap: {
    type: [String],
    default: () => '1px',
  },
  // 开始滚动时的偏移值 比如你想从第二个item开始滚动
  offSet: {
    type: [Number],
    default: () => 0,
  },
})

const prScrollRef: Ref = ref()
const prScrollContentFirstRef: Ref = ref()

const _list: any = ref([]) // 数据列表
const _offSet = ref(0) // 滚动的差值

const mouse_in = ref(false) // 鼠标是否移入
let timer = 0

// 需要根据props初始化
const options = ref({
  gap_num: 1, // 间隔数值 每次滚动多少距离
  gap_unit: 'px', // 间隔单位 默认px
  gap_auto: false, // 自动间隔 将每次自动滚动一个item
  gap_auto_index: 0, // 自动间隔时 滚动的起点index 与
  interval: props.interval,
  height: 0, // 父级容器高度
  contentHeight: 0, // 滚动面板高度
})

const overflow = ref(false) // 默认没有超出不需要滚动

const initOptions = async () => {
  clearInterval(timer)
  const { gap, list } = props
  _list.value = list
  overflow.value = false
  _offSet.value = props.offSet
  options.value.gap_unit = gap.replace(/[0-9]*/g, '').replace(/\./, '')
  options.value.gap_num = Number(gap.replace(options.value.gap_unit, ''))
  // 查询节点高度
  {
    // await new Promise((a) => setTimeout(() => a(true), 300))
    await nextTick()
    options.value.height = prScrollRef.value.offsetHeight
    options.value.contentHeight = prScrollContentFirstRef.value.offsetHeight
  }
  const { height, contentHeight } = options.value
  // console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:height, contentHeight`, height, contentHeight)
  if (height < contentHeight) {
    overflow.value = true
  }
}

// 自动滚动时判断是否需要重置
const isReset = async (offSet = _offSet.value) => {
  const { contentHeight } = options.value
  // 不能小于0 并且 偏移值大于整个content高度则重置为0
  if (offSet < 0) {
    _offSet.value = 0
  }
  // 偏移值大于一个内容高度时 平移到first
  if (offSet >= contentHeight) {
    _offSet.value = offSet - contentHeight
  }
}

const autoPlay = async () => {
  await nextTick()
  if (overflow.value === false) return
  const { gap_num, interval } = options.value
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (mouse_in.value) return // 鼠标移入时停止
    _offSet.value += gap_num
    isReset(_offSet.value)
  }, interval)
}

// 鼠标滚轮事件
const mousewheel = (e: any) => {
  if (overflow.value === false) return
  const { height, contentHeight } = options.value
  const { wheelDeltaY } = e
  let to_offSet = _offSet.value - wheelDeltaY
  // 根据当前offset 来生成动态的 [minOffsetY maxOffsetY]
  // 三种情况 1、视图区域只有first 2、试图区域只有last 3、试图区域包含first和last
  // 默认 3、试图区域包含first和last
  let minOffsetY = 0
  let maxOffsetY = contentHeight * 2 - height
  // 1、视图区域只有first
  if (_offSet.value <= contentHeight - height) {
    minOffsetY = 0
    maxOffsetY = contentHeight - height
  }
  // 2、试图区域只有last
  if (_offSet.value >= contentHeight) {
    minOffsetY = contentHeight
    maxOffsetY = contentHeight * 2 - height
  }
  to_offSet = Math.max(minOffsetY, to_offSet)
  to_offSet = Math.min(maxOffsetY, to_offSet)
  _offSet.value = to_offSet
}

// 鼠标移入时对 offSet 进行修正
const mouseenter = () => {
  // const { height, contentHeight } = options.value
  // if (_offSet.value >= contentHeight) {
  //   _offSet.value = _offSet.value - contentHeight - height
  // }
  mouse_in.value = true
}
// 鼠标移入时对 offSet 进行修正
const mouseleave = () => {
  // const { height, contentHeight } = options.value
  // _offSet.value = Math.min(contentHeight * 2 - height, _offSet.value)
  mouse_in.value = false
}

const Style_content = computed(() => {
  let style = { transform: 'translate(0)' }
  const { gap_unit = 'px' } = options.value
  style['transform'] = `translateY(-${_offSet.value}${gap_unit})`
  return style
})

// 数据发送变化时需要重新 initOptions
watch(
  () => props.list,
  async () => {
    await initOptions()
    autoPlay()
  },
  {
    immediate: true,
  }
)

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
<template>
  <div ref="prScrollRef" class="pr-scroll" @mouseenter="mouseenter" @mouseleave="mouseleave" @mousewheel.stop="mousewheel">
    <div class="pr-scroll-content" :class="[{ 'pr-scroll-content-transition': options.gap_auto || mouse_in }]" :style="[Style_content]">
      <div ref="prScrollContentFirstRef" class="pr-scroll-content-first">
        <div class="pr-scroll-content-item" v-for="(item, index) in _list" :key="index">
          <slot name="item" v-bind="item"></slot>
        </div>
      </div>
      <div class="pr-scroll-content-last" :class="[{ 'pr-scroll-content-last-show': overflow }]">
        <div class="pr-scroll-content-item" v-for="(item, index) in _list" :key="index">
          <slot name="item" v-bind="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.pr-scroll {
  height: 100%;
  overflow: hidden;
}
.pr-scroll-content {
  display: flex;
  flex-direction: column;
}
.pr-scroll-content-transition {
  transition: all 300ms ease-out;
}
.pr-scroll-content > div {
  width: 100%;
}
.pr-scroll-content-last {
  height: 0;
  opacity: 0;
  overflow: hidden;
}
.pr-scroll-content-last-show {
  height: auto;
  opacity: 1;
}
</style>
