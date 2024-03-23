import { Store, useStore } from "@tanstack/react-store";


const _usingKeyboardStore = new Store(false)

// Let the document know when the mouse is being used
document.body.addEventListener('mousedown', () => {
  _usingKeyboardStore.setState((_) => false)
});

// Re-enable focus styling when Tab is pressed
document.body.addEventListener('keydown', ({ key }) => {
  if (key === 'Tab') {
    _usingKeyboardStore.setState((_) => true)
  }
});

export const useUsingKeyboard = () => useStore(_usingKeyboardStore)
