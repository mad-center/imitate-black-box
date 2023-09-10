<script lang="ts" setup>
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar'
import MouseWheel from '@better-scroll/mouse-wheel'
import { nextTick, ref, watch } from 'vue'
const props = defineProps({
  data: {
    default: () => []
  },
  options: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['init'])
BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

const defaultOptions = {
  mouseWheel: true,
  scrollY: true,
  scrollbar: true,
  probeType: 3
}
let scroller: any = null
const scrollerRef = ref()

watch(() => props.data, async () => {
  await nextTick()
  if (!scroller) {
    scroller = new BScroll(
      scrollerRef.value,
      // @ts-expect-error todo
      Object.assign({}, defaultOptions, props.options)
    )
    emits('init', scroller)
  }
  else {
    scroller.value?.refresh()
  }
})
function getScroller() {
  return scroller
}

defineExpose({
  getScroller
})
</script>

<template>
  <div
    ref="scrollerRef"
    class="scroller"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.scroller {
  position: relative;
  overflow: hidden;
  height: 100%;

  .bscroll-indicator {
    border: none !important;
    background: var(--scrollbar-color) !important;
  }
}
</style>
