import Tooltip from '@/middleware/plugins/tooltip'
//  Helpers
const defaultPosition = 'bottom'
const fstItemArr = array => Array.isArray(array) && array.length ? array[0] : null

export default {
  bind(el, { modifiers, value }) {
    if (!value || value.content === '')
      return

    const options = {
      position: fstItemArr(Object.keys(modifiers)) ?? value.position ?? defaultPosition,
      content: typeof value === 'object' && value.content
        ? value.content
        : value,
      ...(typeof value === 'object' ? value : {}),
    }

    new Tooltip(el, options)
  },
  update(el, { modifiers, value }) {
    if (!value || value.content === '')
      return

    const options = {
      position: fstItemArr(Object.keys(modifiers)) ?? value.position ?? defaultPosition,
      content: typeof value === 'object' && value.content
        ? value.content
        : value,
      ...(typeof value === 'object' ? value : {}),
    }

    if (el.$tooltip) {
      el.$tooltip.position = options.position
      el.$tooltip.content = options.content
    } else
      new Tooltip(el, options)
  },
  unbind(el) {
    if (!el.$tooltip)
      return

    el.$tooltip.destroy()
  }
}