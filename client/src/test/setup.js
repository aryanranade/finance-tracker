import '@testing-library/jest-dom'

// framer-motion's useInView relies on IntersectionObserver — stub for jsdom
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = globalThis.IntersectionObserver || IntersectionObserverStub

// jsdom lacks matchMedia (used by framer-motion for reduced-motion detection)
globalThis.matchMedia =
  globalThis.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }))
