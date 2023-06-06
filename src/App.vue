<script setup lang="ts">
import PrScroll from './components/PrScroll/PrScroll.vue'
import { ref } from 'vue'

const list = ref([
  { id: 1, name: '小明1', age: 18, height: '200px', bg: 'rgb(201, 106, 17)' },
  { id: 2, name: '小王2', age: 18, height: '220px', bg: '#0097ff' },
  { id: 3, name: '小王3', age: 18, height: '439px', bg: 'green' },
  { id: 4, name: '小王4', age: 18, height: '206px', bg: 'rgb(24, 60, 107)' },
  { id: 5, name: '小王5', age: 18, height: '186px', bg: 'rgb(24, 160, 107)' },
  { id: 6, name: '小王6', age: 18, height: '296px', bg: 'rgb(24, 201, 107)' },
  { id: 7, name: '小王7', age: 18, height: '200px', bg: 'rgb(1, 106, 17)' },
  { id: 8, name: '小王8', age: 18, height: '300px', bg: 'rgb(21, 206, 117)' },
])
const select = (item: any) => {
  console.log('\x1b[38;2;0;151;255m%c%s\x1b[0m', 'color:#0097ff;padding:16px 0;', `------->Breathe:item`, item)
}
// setTimeout(() => {
//   let _list = [...list.value]
//   _list.push({ id: 9, name: '小王9', age: 19, height: '300px', bg: 'red' })
//   list.value = _list
// }, 3000)
</script>

<template>
  <div class="list">
    <!-- <PrScroll :list="list"> -->
    <PrScroll :list="list" :interval="4">
      <template #item="item">
        <div class="item" :style="[{ height: item.height }]">
          <div class="item-content" :style="[{ 'background-color': item.bg }]" @click="select(item)">
            {{ item.name }}
          </div>
        </div>
      </template>
    </PrScroll>
  </div>
</template>

<style scoped>
/* 必须要 不然不生效 */
/* ::-webkit-scrollbar {
  position: relative;
  width: 0;
  height: 0;
} */

.list {
  padding: 4px 0;
  box-sizing: border-box;
  position: relative;
  width: 500px;
  height: 700px;
  border: 1px solid;
  overflow: hidden;
}
.item {
  padding: 4px 0;
  box-sizing: border-box;
  height: 200px;
}
.item-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(24, 60, 107);
}
</style>
