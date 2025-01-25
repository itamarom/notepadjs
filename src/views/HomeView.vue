<script setup lang="ts">
import type { FileSelectedCallback, IFileSystem, IFileSystemFileHandle } from '@/lib/fs'
import { LocalStorageFs } from '@/lib/local-storage-fs'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Editor from '../components/Editor.vue'
import LocalStorageOpenModal from '../components/LocalStorageOpenModal.vue'
import LocalStorageSaveModal from '../components/LocalStorageSaveModal.vue'
import Menu from '../components/Menu.vue'
import Tabs from '../components/Tabs.vue'
import type { Tab } from '../types/types'
import { LocalFs } from '@/lib/local-fs'


const tabs = ref<Tab[]>([])
const activeTab = ref<Tab | null>(null)

const openLocalStorageFileCallback = ref<FileSelectedCallback | null>(null);
const saveLocalStorageFileCallback = ref<FileSelectedCallback | null>(null);
const isPwa = ref(false);

window.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isPwa.value = true;
  }
});

const handleCloseTab = (tab: Tab) => {
  const tabIndex = tabs.value.indexOf(tab)
  if (tab.unsaved) {
    activeTab.value = tab
    if (confirm(`Are you sure you want to close '${tab.title || 'Untitled'}' without saving?`)) {
      tabs.value.splice(tabIndex, 1)
    }
  } else {
    tabs.value.splice(tabIndex, 1)
  }

  if (tabs.value.length === 0) {
    addNewTab()
  } else {
    if (tabIndex >= tabs.value.length) {
      activeTab.value = tabs.value[tabs.value.length - 1]
    } else {
      activeTab.value = tabs.value[tabIndex]
    }
  }
}

const addNewTab = () => {
  const newTab: Tab = {
    id: uuidv4(),
    unsaved: false,
    content: ''
  }

  tabs.value.push(newTab)
  activeTab.value = newTab
}

const isEmptyState = () =>
  tabs.value.length === 1 &&
  tabs.value[0].handle === undefined &&
  tabs.value[0].content.length === 0

const findTabByHandle = async (handle: IFileSystemFileHandle) => {
  for (const tab of tabs.value) {
    if (tab.handle && (await tab.handle.isSameEntry(handle))) {
      return tab
    }
  }
}

const onWindowKeyDown = (e: KeyboardEvent) => {
  if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'n') {
    e.preventDefault()
    addNewTab()
  } else if ((e.ctrlKey === true || e.metaKey === true) && e.key === 'o') {
    e.preventDefault()
    handleOpen()
  }
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
    e.preventDefault()
    handleSave(e.shiftKey)
  }
}

const beforeWindowUnload = (e: Event) => {
  const unsavedTabs = tabs.value.filter((tab) => tab.unsaved)
  if (unsavedTabs.length > 0) {
    e.preventDefault();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onWindowKeyDown)
  window.addEventListener('beforeunload', beforeWindowUnload)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onWindowKeyDown)
  window.removeEventListener('beforeunload', beforeWindowUnload)
})

const openFileTab = async (handle: IFileSystemFileHandle) => {
  const existingTab = await findTabByHandle(handle)

  if (existingTab) {
    activeTab.value = existingTab
    return
  }


  const newTab: Tab = {
    id: uuidv4(),
    unsaved: false,
    title: handle.name,
    handle,
    content: await handle.getContent()
  }

  if (isEmptyState()) {
    tabs.value.push(newTab)
    tabs.value.splice(0, 1)
  } else {
    tabs.value.push(newTab)
  }

  activeTab.value = newTab
}

function getFilesystem(): IFileSystem {
  if (LocalFs.isSupported()) {
    return new LocalFs();
  }

  return new LocalStorageFs(localStorage, (callback) => {
    openLocalStorageFileCallback.value = (handle) => {
      callback(handle);
      openLocalStorageFileCallback.value = null;
    };
  }, (_suggestedName, callback) => {
    saveLocalStorageFileCallback.value = (handle) => {
      callback(handle);
      saveLocalStorageFileCallback.value = null;
    };
  });
}

const fs = getFilesystem();

const handleValueChange = (e: Event) => {
  const target = e.target as HTMLTextAreaElement

  if (!activeTab.value) {
    return
  }

  activeTab.value.unsaved = target.value.length != 0
  activeTab.value.content = target.value
}

onMounted(() => {
  addNewTab()
})

const handleOpen = () => {
  fs.showOpenFilePicker(openFileTab)
}

const handleSave = async (as: boolean) => {
  if (!activeTab.value) {
    return
  }

  if (as || activeTab.value.handle === undefined) {
    fs.showSaveFilePicker(activeTab.value.handle?.name, (handle) => {
      if (!activeTab.value) {
        console.warn('No active tab');
        return;
      }
      activeTab.value.handle = handle
      activeTab.value.title = handle.name
      saveFileToHandle();
    })
  } else {
    saveFileToHandle();
  }

}

const saveFileToHandle = async () => {
  if (!activeTab.value) {
    console.warn('No active tab');
    return;
  }

  await activeTab.value.handle!.writeContent(activeTab.value.content);
  activeTab.value.unsaved = false
}

const handleMenuItemClicked = (item: string) => {
  if (item === 'New') {
    addNewTab()
  } else if (item === 'Open') {
    handleOpen()
  } else if (item === 'Save') {
    handleSave(false)
  } else if (item === 'Save as...') {
    handleSave(true)
  }
}

watch(activeTab, (newTab) => {
  const prefix = isPwa.value ? '' : 'Notepad - '
  document.title = `${prefix}${newTab?.title || 'Untitled'}`
})

</script>

<template>
  <div class="container">
    <Tabs v-bind:tabs="tabs" v-bind:selected-tab-id="activeTab?.id || ''" @tab-selected="($tab) => (activeTab = $tab)"
      @tab-closed="handleCloseTab" @new-tab="addNewTab" />
    <Menu @item-clicked="handleMenuItemClicked" />
    
    <template v-if="fs instanceof LocalStorageFs">
      <LocalStorageOpenModal v-if="openLocalStorageFileCallback" :fs="fs"
        @file-selected="openLocalStorageFileCallback" />
      <LocalStorageSaveModal v-if="saveLocalStorageFileCallback" @close="() => saveLocalStorageFileCallback = null"
        :fs="fs" @file-selected="saveLocalStorageFileCallback" />
    </template>

    <Editor :key="activeTab?.id" @change="handleValueChange" :initial-value="activeTab?.content || ''" />
  </div>
</template>

<style>
* {
  color: black;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
