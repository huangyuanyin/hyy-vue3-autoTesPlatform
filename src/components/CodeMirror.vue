<template>
  <!-- :indent-with-tab="true" 是否自动获取焦点-->
  <codemirror
    v-model="props.code"
    placeholder="Code gose here..."
    :style="props.codeStyle"
    :autofocus="true"
    :tabSize="2"
    :extensions="extensions"
  />
</template>
<!-- @ready="ready('ready', $event)" @change="Change('change', $event)" @focus="focus('focus', $event)" @blur="blur('blur', $event)" -->

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror'
// import { javascript } from '@codemirror/lang-javascript'
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

const extensions = [myTheme]

const Change = () => {}

onMounted(() => {})
</script>
