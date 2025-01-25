<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';


const emit = defineEmits<{
    (e: 'close'): void,
}>()

const onWindowKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        emit('close');
    }
}

onMounted(() => {
    window.addEventListener('keydown', onWindowKeyDown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onWindowKeyDown)
})
</script>

<template>
    <div class="modal">
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.container {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
    height: 400px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>