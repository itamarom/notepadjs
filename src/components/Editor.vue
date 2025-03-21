<script setup lang="ts">
import { getLastFontSize, setLastFontSize } from '@/lib/preferences';
import { reactive, ref, onMounted, watch } from 'vue'

const props = defineProps<{
  initialValue: string
}>()

const emit = defineEmits<{
  (e: 'change', event: Event): void
}>()

const textArea = ref<HTMLTextAreaElement | null>(null)

const status = reactive({
  line: 1,
  column: 1
})

const direction = ref('ltr')
const prevValue = ref(props.initialValue)

const StartFontSize = 20

const FontSizeDelta = 2
const fontSize = ref(getLastFontSize())

watch(fontSize, (newSize: number) => {
  setLastFontSize(newSize)
})

const onKeyDown = function (e: KeyboardEvent) {
  const target = e.target as HTMLTextAreaElement

  if (e.key === 'Tab') {
    e.preventDefault()
    var start = target.selectionStart
    var end = target.selectionEnd

    target.value = target.value.substring(0, start) + '\t' + target.value.substring(end)

    target.selectionStart = target.selectionEnd = start + 1
  }

  if (e.ctrlKey && e.key === '=') {
    fontSize.value += FontSizeDelta
  }

  if (e.ctrlKey && e.key === '-') {
    fontSize.value = Math.max(1, fontSize.value - FontSizeDelta)
  }

  if (e.ctrlKey && e.key === '0') {
    fontSize.value = StartFontSize
  }

  if (e.ctrlKey && e.code == 'ShiftLeft') {
    direction.value = 'ltr'
  }

  if (e.ctrlKey && e.code == 'ShiftRight') {
    direction.value = 'rtl'
  }
}

const updateStatus = function (e: Event) {
  const target = e.target as HTMLTextAreaElement

  if (target.value !== prevValue.value) {
    prevValue.value = target.value
    emit('change', e)
  }

  let selectionIndex = target.selectionStart

  if (target.selectionDirection === 'forward') {
    selectionIndex = target.selectionEnd
  } else if (target.selectionDirection === 'backward') {
    selectionIndex = target.selectionStart
  }

  const lines = target.value.substr(0, selectionIndex).split('\n')
  status.line = lines.length
  status.column = lines[lines.length - 1].length + 1
}

onMounted(() => {
  if (textArea.value) {
    textArea.value.focus();
  }
})

</script>

<template>
  <div class="container">
    <textarea
      :initialValue="props.initialValue"
      ref="textArea"
      autofocus="true"
      @keydown="onKeyDown"
      @keypress="updateStatus"
      @keyup="updateStatus"
      @mousedown="updateStatus"
      @touchstart="updateStatus"
      @input="updateStatus"
      @paste="updateStatus"
      @cut="updateStatus"
      @mousemove="updateStatus"
      @select="updateStatus"
      @selectstart="updateStatus"
      v-bind:dir="direction"
    >{{ props.initialValue }}</textarea>
    <div class="status">Ln {{ status.line }}, Col {{ status.column }}</div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
textarea {
  background-color: #f9f9f9;
  color: black;
  font-size: v-bind(fontSize + 'pt');
  width: 100%;
  flex: 1;
  padding: 16px 10px 16px 10px;
  resize: none;
  outline: none;
  border: none;
  text-wrap: unrestricted;
}

.status {
  background-color: #ebf8fb;
  color: #4c5256;
  padding: 8px 0 8px 16px;
  font-size: 0.8em;
  user-select: none;
  box-shadow: inset 0 1px 6px rgba(0, 0, 0, 0.1);
}
</style>
