<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { type Tab } from '../types/types'
import BetaIcon from './BetaIcon.vue'
import { isBeta } from '@/lib/build-params';
const ScrollDelta = 50;

const props = defineProps<{
  tabs: Tab[]
  selectedTabId: string
}>()

const emit = defineEmits<{
  (e: 'tabSelected',  tab: Tab): void
  (e: 'tabClosed',  tab: Tab): void
  (e: 'newTab'): void
}>()

const scrolling = ref(false)

const tabsContainer = ref<HTMLDivElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const onResize = () => {
  if (tabsContainer.value) {
    scrolling.value = tabsContainer.value.scrollWidth > tabsContainer.value.clientWidth
  }
}

const onMouseDown = (event: MouseEvent, tab: Tab) => {
  const wheelButtonClicked = (event.button === 1);

  if (wheelButtonClicked) {
    emit('tabClosed', tab)
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(tabsContainer.value!)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div class="container">
    <img class="logo" src="/Notepad.png" />
    <BetaIcon v-if="isBeta" />
    <button v-if="scrolling" @click="($event) => (tabsContainer!.scrollLeft -= ScrollDelta)">
      &lt;
    </button>
    <div class="tabs-container" ref="tabsContainer">
      <div
        v-bind:key="tab.id"
        v-for="tab in props.tabs"
        class="tab"
        :class="{ selected: props.selectedTabId === tab.id }"
        @click="emit('tabSelected', tab)"
        @mousedown="e => onMouseDown(e, tab)"
      >
        {{ tab.title || 'Untitled' }}
        <div class="tab-unsaved-dot" v-if="tab.unsaved"></div>
        <div class="tab-close" @click.stop="emit('tabClosed', tab)">X</div>
      </div>
    </div>
    <button v-if="scrolling" @click="($event) => (tabsContainer!.scrollLeft += ScrollDelta)">&gt;</button>
    <button @click="emit('newTab')">+</button>
  </div>
</template>

<style scoped>
.container {
  height: 32px;
  background-color: #cdddec;
  display: flex;
  flex-direction: row;
}

.logo {
  height: 100%;
  padding: 8px;
}

.tabs-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.tab {
  border: 1px solid transparent;
  border-bottom: none;
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
  max-width: 250px;
  min-width: 50px;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  user-select: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.tab:before {
  content: '';
  width: 1px;
  height: 50%;
  background: #cacaca;
  position: absolute;
  bottom: -4px;
  top: calc(25%);
  right: 0;
}

.tab:hover:before,
.tab.selected:before {
  display: none;
}

.tab:hover .tab-close {
  display: block;
}

.tab:hover {
  background-color: #c0d4e7;
}

.tab-unsaved-dot {
  position: absolute;
  right: 16px;
  border-radius: 99px;
  width: 6px;
  height: 6px;
  background-color: gray; 
}

.tab-close {
  position: absolute;
  right: 6px;
  display: none;
  padding: 2px 8px 2px 8px;
  border-radius: 8px;
  background-color: #c6d2de;
}

.tab-close:hover {
  background-color: #bbcad8;
}

.tab.selected,
.tab.selected:hover {
  background-color: #f0f5f9;
  border: 1px solid #c6d2de;
  border-bottom: none;
  font-weight: 500;
}

.tab.selected .tab-close {
  background-color: #f0f5f9;
}

.tab.selected .tab-close:hover {
  background-color: #e2ecf3;
}
</style>
