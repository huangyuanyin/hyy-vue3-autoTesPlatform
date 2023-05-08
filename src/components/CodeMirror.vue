<template>
  <codemirror
    v-model="code"
    placeholder="Code gose here..."
    :style="props.codeStyle"
    :autofocus="true"
    :tabSize="2"
    :extensions="extensions"
    @input="onCodeChange"
  />
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
// import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { onMounted, ref, watch } from 'vue'
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

const code = ref('')

watch(
  () => props.code,
  () => {
    console.log(`output->props.code`, props.code)
    code.value = props.code
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

const extensions = [myTheme, python()]

const onCodeChange = () => {
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
}
</style>
