<template>
  <codemirror
    v-model="code"
    placeholder="Code goes here..."
    :style="props.codeStyle"
    :tabSize="2"
    :extensions="extensions"
    @input="onCodeChange"
  />
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
// import { python } from '@codemirror/lang-python'
// import { oneDark } from '@codemirror/theme-one-dark'
import { onMounted, ref, watch, defineProps, defineEmits } from 'vue'
import { EditorView } from '@codemirror/view'

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  codeStyle: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['onCodeChange'])

const code = ref(props.code)

watch(
  () => props.code,
  newCode => {
    code.value = newCode
  },
  {
    immediate: true
  }
)

let myTheme = EditorView.theme(
  {
    '&': {
      color: '#fff',
      backgroundColor: '#000'
    },
    '.cm-content': {
      caretColor: '#fff',
      color: 'white' // 所有内容为白色
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#fff'
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#fff'
    },
    '.cm-gutters': {
      backgroundColor: '#000',
      color: '#8f908a',
      border: 'none'
    }
  },
  { dark: true }
)

const extensions = [myTheme, javascript()]

const onCodeChange = () => {
  emit('onCodeChange', code.value)
}

const handlePaste = event => {
  const text = event.clipboardData.getData('text/plain')
  const startPosition = event.target.selectionStart
  const endPosition = event.target.selectionEnd
  code.value = code.value.slice(0, startPosition) + text + code.value.slice(endPosition)
  console.log(`output->code.value`, text, event, endPosition, code.value)
  emit('onCodeChange', code.value)
}

onMounted(() => {})
</script>

<style lang="scss">
.cm-editor {
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
    background: hsla(0, 0%, 100%, 0.6);
  }

  ::-webkit-scrollbar-track {
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: rgba(95, 95, 95, 0.4);
    transition: all 0.2s;
    border-radius: 0.5rem;

    &:hover {
      background-color: rgba(95, 95, 95, 0.7);
    }
  }
  .cm-scroller {
    .cm-line {
      .cm-gutterElement {
        color: white !important;
      }
      .ͼd,
      .ͼb,
      .ͼc,
      .ͼe {
        color: white !important;
      }
    }
  }
}
</style>
