import { ref, onMounted, onUnmounted } from 'vue'

declare global {
  interface HTMLImageElement {
    _observer?: IntersectionObserver
  }
}

export function useLazyLoad(container?: string) {
  const observer = ref<IntersectionObserver | null>(null)
  const observedElements = ref<Set<Element>>(new Set())

  const initObserver = () => {
    if (observer.value) return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              img.classList.add('lazy-loaded')
            }
            observer.value?.unobserve(img)
            observedElements.value.delete(img)
          }
        })
      },
      {
        root: container ? document.querySelector(container) : null,
        rootMargin: '50px',
        threshold: 0.01
      }
    )
  }

  const observe = (el: HTMLImageElement) => {
    if (!observer.value) {
      initObserver()
    }
    if (el && el.dataset.src && !observedElements.value.has(el)) {
      observer.value?.observe(el)
      observedElements.value.add(el)
    }
  }

  const unobserve = (el: HTMLImageElement) => {
    if (observer.value && el) {
      observer.value.unobserve(el)
      observedElements.value.delete(el)
    }
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    if (observer.value) {
      observedElements.value.forEach((el) => {
        observer.value?.unobserve(el)
      })
      observer.value.disconnect()
      observer.value = null
    }
    observedElements.value.clear()
  })

  return {
    observe,
    unobserve
  }
}

export const lazyLoadDirective = {
  mounted(el: HTMLImageElement) {
    if (!el.dataset.src) return

    const loadImage = () => {
      const img = new Image()
      img.onload = () => {
        el.src = el.dataset.src!
        el.classList.add('lazy-loaded')
      }
      img.src = el.dataset.src!
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage()
              observer.unobserve(el)
            }
          })
        },
        { rootMargin: '100px' }
      )
      observer.observe(el)
      el._observer = observer
    } else {
      loadImage()
    }
  },
  unmounted(el: HTMLImageElement) {
    if (el._observer) {
      el._observer.disconnect()
      delete el._observer
    }
  }
}


