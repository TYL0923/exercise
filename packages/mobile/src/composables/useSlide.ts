export function useSlide(
  target: HTMLElement,
  effectFn: Partial<Record<'leftSlide' | 'rightSlide' | 'topSlide' | 'bottomSlide', () => void>>,
  option: {
    triggerDistance: number
  } = {
    triggerDistance: 50,
  },
) {
  const startPoninter = ref<Record<'x' | 'y', number>>({
    x: 0,
    y: 0,
  })
  const endPoninter = ref<Record<'x' | 'y', number>>({
    x: 0,
    y: 0,
  })
  function trigger() {
    if (Math.abs(endPoninter.value.x - startPoninter.value.x) > option.triggerDistance) {
      if (endPoninter.value.x < startPoninter.value.x)
        return leftSlide()
      else return rightSlide()
    }
    if (Math.abs(endPoninter.value.y - startPoninter.value.y) > option.triggerDistance) {
      if (endPoninter.value.y < startPoninter.value.y)
        return topSlide()
      else return bottomSlide()
    }
  }
  function leftSlide() {
    effectFn.leftSlide && effectFn.leftSlide()
  }
  function rightSlide() {
    effectFn.rightSlide && effectFn.rightSlide()
  }
  function topSlide() {
    effectFn.topSlide && effectFn.topSlide()
  }
  function bottomSlide() {
    effectFn.bottomSlide && effectFn.bottomSlide()
  }
  function handleTouchStart(event: TouchEvent) {
    startPoninter.value.x = event.changedTouches[0].pageX
    startPoninter.value.y = event.changedTouches[0].pageY
  }
  function handleTouchEnd(event: TouchEvent) {
    endPoninter.value.x = event.changedTouches[0].pageX
    endPoninter.value.y = event.changedTouches[0].pageY
    trigger()
  }
  target.addEventListener('touchstart', handleTouchStart, false)
  target.addEventListener('touchend', handleTouchEnd, false)
  return {

  }
}
