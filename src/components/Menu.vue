<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MenuItem from './MenuItem.vue'
import { LocalFs } from '@/lib/local-fs';
import { getPreferredFsType, FsType } from '@/lib/preferences';

const activeItem = ref<string | null>(null);

const emit = defineEmits<{
  (e: 'itemClicked', item: unknown): void,
  (e: 'changeFsType', fsType: unknown): void
}>()

const onWindowClick = () => {
  activeItem.value = null;
};

const onItemClick = (e: Event, title: string) => {
  e.stopPropagation();

  if (activeItem.value === title) {
    activeItem.value = null;
  } else {
    activeItem.value = title;
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick);
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick);
})

const handleSubItemClicked = (item: unknown) => {
  activeItem.value = null;
  emit('itemClicked', item)
}

const preferredFsType = getPreferredFsType();

</script>

<template>
  <div class="container">
    <MenuItem title="File" :options="[{ text: 'New' }, { text: 'Open' }, { text: 'Save' }, { text: 'Save as...' }]"
      @click="onItemClick" v-bind:activeItem="activeItem" @subItemClicked="handleSubItemClicked" />
    <MenuItem title="File system" :options="[{
      text: 'Local',
      disabled: !LocalFs.isSupported(),
      checked: preferredFsType === FsType.localFs,
      value: FsType.localFs
    },
    {
      text: 'Local storage',
      checked: getPreferredFsType() === FsType.localStorageFs,
      value: FsType.localStorageFs
    }]" @click="onItemClick" v-bind:activeItem="activeItem" @subItemClicked="emit('changeFsType', $event)" />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  height: 32px;
  padding-left: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #F0F5F9;
}
</style>
