import { onMounted, onUnmounted, ref } from 'vue';

export function useFullscreen() {
  const isFullscreen = ref(false);

  function checkFullscreen() {
    isFullscreen.value = !!document.fullscreenElement;
  }

  function toggle() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error('Failed to exit fullscreen:', err);
        });
      }
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', checkFullscreen);
  });

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', checkFullscreen);
  });

  return {
    isFullscreen,
    toggle,
  };
}
