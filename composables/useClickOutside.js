import { onMounted, onUnmounted } from 'vue'

export function useClickOutside(callback) {
  const handleClick = (event) => {
    callback(event)
  }

  onMounted(() => {
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClick)
  })
} 