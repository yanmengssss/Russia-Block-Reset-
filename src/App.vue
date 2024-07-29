<script setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue';
import Dialog from '@/components/Dialog.vue'
const Visible = ref(false)//显示模态框
const begin = ref(false)//开始
const row = 20//确定行数
const col = 12//确定列数
const Map = ref([])//确定地图
const typeLine = ["S", "Z", "J", "L", "I", "O", 'T']
const nowRow = ref(0)//用来计算下移的量
const nowcol = ref(4)//用来计算左右的移动，为了一开始在中间出现，我们设初始值为4
const nexttype_type = ref(0)//下一个具体角度
const nextType = ref('')//确定下一个的形状
const type = ref('')//用来确定本次方块的形状
const type_type = ref(0)//用来确定本次方块的具体角度，比如Block[type.value][type_type.value]
const block = ref([]);//确定现在的方块
const Previews = ref([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
])//确定预览的方块
const T = ref(null)//定时器，用来向下移动
const speed = ref(50)//速度，其实就是定时器的间隔
const count = ref(0)//得分
//开始游戏
const BeginGame = () => {
  init()
  begin.value = !begin.value
}
//关闭模态框
const closeDialog = () => {
  Visible.value = false
}
//重新开始
const ReatartGame = () => {
  init()
}
//初始化地图
const makeMap = () => {
  let Map_temp = []
  for (let i = 0; i < row; i++) {
    let line = []
    for (let j = 0; j < col; j++) {
      line.push(0)
    }
    Map_temp.push(line)
  }
  Map.value = Map_temp
}
const Block = {
  "S": [
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0]
    ]
  ],
  "Z": [
    [
      [2, 2, 0, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 2, 0],
      [0, 2, 2, 0],
      [0, 2, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  "J": [
    [
      [0, 3, 0, 0],
      [0, 3, 0, 0],
      [3, 3, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [3, 0, 0, 0],
      [3, 3, 3, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 3, 3, 0],
      [0, 3, 0, 0],
      [0, 3, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [3, 3, 3, 0],
      [0, 0, 3, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  "L": [
    [
      [0, 4, 0, 0],
      [0, 4, 0, 0],
      [0, 4, 4, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [4, 4, 4, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [4, 4, 0, 0],
      [0, 4, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 4, 0],
      [4, 4, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  "I": [
    [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0]
    ],
    [
      [5, 5, 5, 5],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  "O": [
    [
      [0, 6, 6, 0],
      [0, 6, 6, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ],
  "T": [
    [
      [0, 7, 0, 0],
      [7, 7, 0, 0],
      [0, 7, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 7, 0, 0],
      [7, 7, 7, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 7, 0, 0],
      [0, 7, 7, 0],
      [0, 7, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [7, 7, 7, 0],
      [0, 7, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ]
}
//定义一个初始化
const init = async () => {
  setTimeout(() => {

  }, 2000)
  count.value = 0
  speed.value = 50
  nextType.value = typeLine[Math.floor(Math.random() * typeLine.length)]
  nexttype_type.value = Math.floor(Math.random() * Block[nextType.value].length)
  Previews.value = Block[nextType.value][nexttype_type.value]
  makeMap()
  await nextTick();
  changeMapColor()
  beginBlock()
}
//比较数组0的个数
const countZeros = (arr) => {
  return arr.filter(item => item === 0).length;
};
//生成一个新的格子
const beginBlock = () => {
  nowRow.value = 0
  nowcol.value = 4
  type.value = nextType.value
  type_type.value = nexttype_type.value
  block.value = Block[type.value][type_type.value]
  nextType.value = typeLine[Math.floor(Math.random() * typeLine.length)]
  nexttype_type.value = Math.floor(Math.random() * Block[nextType.value].length)
  Previews.value = Block[nextType.value][nexttype_type.value]
  makeBlockColor();
  T.value = setInterval(() => {
    if (check()) {
      clearColor()
      nowRow.value++
      makeBlockColor()
    } else {
      clearInterval(T.value)
      changeMap()
      ifEliminate()
      if (ifLost())
        setTimeout(beginBlock, 0);
    }
  }, speed.value * 10)
}
//清除颜色
const clearColor = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // console.log(block.value[i][j])
      if (block.value[i][j] != 0) {
        // 这里修正了单元格索引计算+
        const index = (i + nowRow.value) * 12 + j + nowcol.value
        document.querySelectorAll('td')[index].className = ``;
      }
    }
  }
}
//渲染地图颜色
const changeMapColor = () => {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 12; j++) {
      // console.log(block.value[i][j])
      if (Map.value[i][j] != 0) {
        // 这里修正了单元格索引计算
        const index = i * 12 + j
        document.querySelectorAll('td')[index].className = `c${Map.value[i][j]}`;
      } else {
        const index = i * 12 + j
        document.querySelectorAll('td')[index].className = ``;
      }
    }
  }
}
//生成颜色的盒子
const makeBlockColor = async () => {
  // console.log(block.value)
  await nextTick();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // console.log(block.value[i][j])
      if (block.value[i][j] != 0) {
        const index = (i + nowRow.value) * 12 + j + nowcol.value
        document.querySelectorAll('td')[index].className = `c${block.value[i][j]}`;
      }
    }
  }
};
//将格子固定到地图上
const changeMap = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (block.value[i][j] != 0) {
        const newRow = i + nowRow.value;
        const newCol = j + nowcol.value
        Map.value[newRow][newCol] = block.value[i][j]
      }
    }
  }
}
//判断是否可以继续下落
const check = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (block.value[i][j] != 0) {
        const newRow = i + nowRow.value + 1;
        const newCol = j + nowcol.value;
        if (newRow >= row || Map.value[newRow][newCol] != 0) {
          return false;
        }
      }
    }
  }
  return true;
}
//左移
const checkLeft = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (block.value[i][j] != 0) {
        const newCol = j + nowcol.value;
        if (newCol == 0 || Map.value[i + nowRow.value][newCol - 1] != 0) {
          return
        }
      }
    }
  }
  clearColor()
  nowcol.value--
  makeBlockColor()
  return
}
//右移
const checkRight = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (block.value[i][j] != 0) {
        const newCol = j + nowcol.value;
        if (newCol == 11 || Map.value[i + nowRow.value][newCol + 1] != 0) {
          return
        }
      }
    }
  }
  clearColor()
  nowcol.value++
  makeBlockColor()
  return
}
//一键下移
const moveDown = () => {
  clearInterval(T.value)
  while (check()) {
    clearColor()
    nowRow.value++
    makeBlockColor()
  }
  changeMap()
  ifEliminate()
  if (ifLost())
    setTimeout(beginBlock, 0);
}
//旋转
const roate = () => {
  const len = Block[type.value].length
  const temp_type = type_type.value
  clearColor()
  if (type_type.value + 1 == len) {
    type_type.value = 0
  } else {
    type_type.value++
  }
  //先看看新的是否符合要求
  const temp = Block[type.value][type_type.value]
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (temp[i][j] != 0 && Map.value[i + nowRow.value][nowcol.value + j] != 0) {
        type_type.value = temp_type
        makeBlockColor()
        return
      }
    }
  }
  block.value = Block[type.value][type_type.value]
  makeBlockColor()
}
//判断是否可以消除
const ifEliminate = async() => {
  for (let i = 0; i < 20; i++) {
    if (countZeros(Map.value[i]) == 0) {
      Map.value.splice(i, 1);
      Map.value.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      await nextTick()
      changeMapColor()
      count.value += 5
    }
  }
};
// 处理键盘事件
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      roate()
      break;
    case 'ArrowLeft':
      checkLeft()
      break;
    case 'ArrowRight':
      checkRight()
      break;
    case 'ArrowDown':
      moveDown()
      break;
  }
};
//判断失败
const ifLost = () => {
  if (countZeros(Map.value[0]) != 12) {
    Visible.value = true
    clearInterval(T.value)
    return false
  }
  return true
}

onMounted(() => {
  // beginBlock()
  // init()
  makeMap()
  window.addEventListener('keydown', handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <video id="video-background" class="video-js vjs-fill vjs-fluid" muted autoplay loop>
    <source src="./assets/bg.mp4" type="video/mp4" />
  </video>
  <div class='actionArea'>
    <el-card style="width: 150px;height: 40px;margin-bottom: 10px" shadow="always">分数:<span style='color:red'>{{
      count }}</span></el-card>
    <el-button type="primary" :disabled="begin" @click="BeginGame">开始</el-button>
    <el-button type="primary" :disabled="!begin" @click="ReatartGame">重新开始</el-button>
    <div class="slider-demo-block">
      <span class="demonstration" style="width: 100px;"><el-text class="mx-1" type="danger">速度间隔</el-text></span>
      <el-slider v-model="speed" />
    </div>
  </div>

  <!-- 地图 -->
  <table border="1">
    <tbody>
      <tr v-for="(row, rowIndex) in Map" :key="rowIndex">
        <td v-for="(cell, colIndex) in row" :key="colIndex" :class="`c${cell}`">
        </td>
      </tr>
    </tbody>
  </table>
  <!-- 预览 -->
  <table border="1" class="Preview">
    <tbody>
      <tr v-for="(row, rowIndex) in Previews" :key="rowIndex">
        <td v-for="(cell, colIndex) in row" :key="colIndex" :class="`c${cell}`">
        </td>
      </tr>
    </tbody>
  </table>
  <Dialog :Visible="Visible" :count="count" @close="closeDialog"></Dialog>
</template>

<style scoped>
#video-background {
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actionArea {
  position: absolute;
  z-index: 100
}

.slider-demo-block {
  max-width: 600px;
  display: flex;
  align-items: center;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.Preview {
  position: absolute;
  z-index: 100;
  right: 80px;
  top: 0px;
}

td {
  width: 30px;
  height: 30px;
  user-select: none;
  border: 1px solid #ddd;
  /* 边框颜色设置为浅灰色 */
  /* 禁用文本选择 */
  outline: none;
  /* 禁用聚焦时的轮廓 */
}

table {
  position: relative;
  margin: 30px auto;
  z-index: 100;
}

table,
tbody,
tr {
  z-index: 100;
  user-select: none;
  border: none;
  border: 1px solid #ddd;
  /* 边框颜色设置为浅灰色 */
  /* 禁用文本选择 */
  outline: none;
  /* 禁用聚焦时的轮廓 */
}


.c1 {
  background-color: red;
}

.c2 {
  background-color: orange;
}

.c3 {
  background-color: yellow;
}

.c4 {
  background-color: green;
}

.c5 {
  background-color: blue;
}

.c6 {
  background-color: indigo;
}

.c7 {
  background-color: violet;
}
</style>
