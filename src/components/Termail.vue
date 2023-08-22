<template>
  <div class="console-wrap">
    <div class="console" id="terminal"></div>
    <!-- <el-button type="primary" link @click="closeTermmail">关闭终端</el-button> -->
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeMount, watch, watchEffect } from 'vue'
import Terminal from '../config/Xterm'

const emit = defineEmits(['closeTermmail'])
const props = defineProps({
  terminal: {
    type: Object,
    default: {
      pid: 1,
      name: 'terminal',
      cols: 100,
      rows: 100
    }
  },
  termmailInfo: {
    type: Object,
    default: () => {}
  },
  isPropFullScreen: {
    type: Boolean,
    default: false
  }
})

const term = ref(null)
const terminalSocket = ref(null)

watchEffect(() => {
  if (props.isPropFullScreen) {
    // term.value.resize(term.value.cols, 50)
  }
})

const runRealTerminal = () => {
  console.log('webSocket is finished')
}
const errorRealTerminal = () => {
  console.log('error')
}
const closeRealTerminal = () => {
  console.log('close')
}

const closeTermmail = () => {
  emit('closeTermmail')
}

onMounted(() => {
  const { docker_name, id } = props.termmailInfo
  console.log('pid : ' + props.terminal.pid + ' is on ready')
  let terminalContainer = document.getElementById('terminal')
  term.value = new Terminal({
    rendererType: 'canvas', //渲染类型
    cursorBlink: true, //光标闪烁
    // cursorStyle: "underline", //光标样式
    scrollback: 50, //终端中的回滚量
    convertEol: true, //启用时，光标将设置为下一行的开头
    theme: {
      foreground: '#ECECEC', //字体
      background: '#000000', //背景色
      cursor: 'help', //设置光标
      lineHeight: 20
    }
  })
  term.value.open(terminalContainer)
  // open websocket
  terminalSocket.value = new WebSocket(`ws://10.4.150.55:8023/ws/docker_online_terminal/${docker_name}/${id}`)
  console.log('dada', terminalSocket.value)
  terminalSocket.value.onopen = runRealTerminal
  terminalSocket.value.onclose = closeRealTerminal
  terminalSocket.value.onerror = errorRealTerminal
  term.value.attach(terminalSocket.value)
  term.value._initialized = true
  console.log('mounted is going on')
})
// name: 'Console',
onBeforeMount(() => {
  terminalSocket.value = null
  term.value = null
})
</script>

<style lang="scss" scoped>
.console-wrap {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .console {
    // margin-top: 40px;
    // height: 500px;
    position: relative;
    :deep(.xterm-text-layer) {
      width: 100%;
      height: 100%;
    }
    :deep(.terminal) {
      height: 100%;
    }
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }
  .button2 {
    top: 20% !important;
    right: 3% !important;
    position: absolute;
  }
  .el-button {
    right: 15px;
    position: absolute;
  }
}
</style>
