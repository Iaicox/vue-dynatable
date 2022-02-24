import anime from '@/middleware/plugins/anime'

/**
 * @class
 * @name Tooltip
 */
export default class Tooltip {
  /**
   * Construct Tooltip instance
   * @constructor
   * @param {Element} elem
   * @param {Object | String} options
   */
  constructor(
    elem,
    options = {}
  ) {
    typeof options === 'string'
      ? options = {content: options}
      : void(0)

    const delayTime = options.delay ?? 200
    const durationTime = options.duration ?? 200

    this.el = elem
    this.tooltip = document.createElement('div')
    this.position = options.position ?? 'bottom'
    this.content = options.content ?? ''

    this._movementDistance = options.movementDistance ?? 10
    this._gap = options.gap ?? 0
    this._delay = {
      enter: typeof delayTime === 'number' ? delayTime : delayTime.enter,
      exit: typeof delayTime === 'number' ? delayTime : delayTime.exit,
    }
    this._duration = {
      enter: typeof durationTime === 'number' ? durationTime : durationTime.enter,
      exit: typeof durationTime === 'number' ? durationTime : durationTime.exit,
    }
    this._timeout = {
      delayEnter: null,
      delayExit: null,
    }
    this._contentWrapper = document.createElement('div')

    this.isOpened = false
    this.isHovered = false
    this.isFocused = false

    Tooltip.init(this)
  }

  static init(self) {
    self.tooltip.classList.add('tooltip')
    self._contentWrapper.classList.add('tooltip-content')
    self._contentWrapper.innerHTML = self.content
    self.tooltip.appendChild(self._contentWrapper)
    self.el.$tooltip = self
    self._setupEventHandlers()
  }

  show(isManual = true) {
    if (this.isOpened)
      return

    this.isOpened = true
    this._updateTooltipContent()
    this._setEnterDelayTimeout(isManual)
  }
  hide() {
    if (!this.isOpened)
      return

    this.isHovered = false
    this.isFocused = false
    this.isOpened = false
    this._setExitDelayTimeout()
  }
  destroy() {
    this.tooltip.remove()
    this._removeEventHandlers()
    this.el.$tooltip = null
  }

  _updateTooltipContent() {
    this._contentWrapper.innerHTML = this.content
  }

  _setEnterDelayTimeout(isManual) {
    clearTimeout(this._timeout.delayEnter)

    this._timeout.delayEnter = setTimeout(() => {
      if (!this.isHovered && !this.isFocused && !isManual)
        return

      this._animateIn()
    }, this._delay.enter)
  }
  _setExitDelayTimeout() {
    clearTimeout(this._timeout.delayExit)

    this._timeout.delayExit = setTimeout(() => {
      if (this.isHovered || this.isFocused)
        return

      this._animateOut()
    }, this._delay.exit)
  }

  _positionTooltip() {
    let targetTop = this.el.getBoundingClientRect().top + this._getDocumentScrollTop()
    let targetLeft = this.el.getBoundingClientRect().left + this._getDocumentScrollLeft()

    switch (this.position) {
      case 'top':
        targetTop += -this.tooltip.offsetHeight - this._gap
        targetLeft += this.el.offsetWidth / 2 - this.tooltip.offsetWidth / 2
        break
      case 'right':
        targetTop += this.el.offsetHeight / 2 - this.tooltip.offsetHeight / 2
        targetLeft += this.el.offsetWidth + this._gap
        break
      case 'left':
        targetTop += this.el.offsetHeight / 2 - this.tooltip.offsetHeight / 2
        targetLeft += -this.tooltip.offsetWidth - this._gap
        break
      case 'bottom':
        targetTop += this.el.offsetHeight + this._gap
        targetLeft += this.el.offsetWidth / 2 - this.tooltip.offsetWidth / 2
        break
    }

    const newCoordinates = this._repositionWithinScreen(
      targetLeft,
      targetTop,
      this.tooltip.offsetWidth,
      this.tooltip.offsetHeight,
    )
    this.tooltip.style.top = newCoordinates.y + 'px'
    this.tooltip.style.left = newCoordinates.x + 'px'
  }
  _repositionWithinScreen(x, y, width, height) {
    const scrollLeft = this._getDocumentScrollLeft()
    const scrollTop = this._getDocumentScrollTop()
    let newX = x - scrollLeft
    let newY = y - scrollTop

    const bounding = {
      left: newX,
      top: newY,
      width: width,
      height: height
    }

    const offset = this._gap + this._movementDistance
    const edges = this._checkWithinContainer(document.body, bounding, offset)

    if (edges.left)
      newX = offset
    else if (edges.right)
      newX -= newX + width - window.innerWidth

    if (edges.top)
      newY = offset
    else if (edges.bottom)
      newY -= newY + height - window.innerHeight

    return {
      x: newX + scrollLeft,
      y: newY + scrollTop
    }
  }

  _insertToDOM() {
    document.body.appendChild(this.tooltip)
    this.isOpened = true
  }
  _removeFromDOM() {
    this.tooltip.remove()
    this.isOpened = false
  }

  _animateIn() {
    this._insertToDOM()
    if (!document.body.contains(this.el))
      return this.hide()

    this._positionTooltip()
    anime.remove(this.tooltip)
    anime({
      targets: this.tooltip,
      opacity: 1,
      translateX: this._movementDistance * (this.position === 'left' ? -1 : (this.position === 'right' ? 1 : 0)),
      translateY: this._movementDistance * (this.position === 'top' ? -1 : (this.position === 'bottom' ? 1 : 0)),
      duration: this._duration.enter,
      easing: 'easeOutCubic'
    })
  }
  _animateOut() {
    anime.remove(this.tooltip)
    anime({
      targets: this.tooltip,
      opacity: 0,
      translateX: 0,
      translateY: 0,
      duration: this._duration.exit,
      easing: 'easeOutCubic'
    })
    setTimeout(() => {
      this._removeFromDOM()
    }, this._duration.exit)
  }

  //  Handle mouse events
  _handleMouseEnter() {
    const self = this instanceof Element ? this.$tooltip : this
    self.isHovered = true
    self.isFocused = false
    self.show(false)
    setTimeout(() => {
      self.hide()
    }, 1500)
  }
  _handleMouseLeave() {
    const self = this instanceof Element ? this.$tooltip : this
    self.isHovered = false
    self.isFocused = false
    self.hide()
  }
  _handleFocus() {
    const self = this instanceof Element ? this.$tooltip : this
    self.isFocused = true
    self.show(false)
  }
  _handleBlur() {
    const self = this instanceof Element ? this.$tooltip : this
    self.isFocused = false
    self.hide()
  }
  _setupEventHandlers() {
    this.el.addEventListener('mouseenter', this._handleMouseEnter)
    this.el.addEventListener('mouseleave', this._handleMouseLeave)
    this.el.addEventListener('focus', this._handleFocus, true)
    this.el.addEventListener('blur', this._handleBlur, true)
  }
  _removeEventHandlers() {
    this.el.removeEventListener('mouseenter', this._handleMouseEnter)
    this.el.removeEventListener('mouseleave', this._handleMouseLeave)
    this.el.removeEventListener('focus', this._handleFocus, true)
    this.el.removeEventListener('blur', this._handleBlur, true)
  }

  //  Helpers
  _getDocumentScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  }
  _getDocumentScrollLeft() {
    return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
  }
  _checkWithinContainer(container, bounding, offset) {
    const containerRect = container.getBoundingClientRect()
    const containerBottom = container === document.body
      ? Math.max(containerRect.bottom, window.innerHeight)
      : containerRect.bottom
    const scrolledX = bounding.left - container.scrollLeft
    const scrolledY = bounding.top - container.scrollTop

    // Check for container and viewport for each edge
    return {
      left: scrolledX < containerRect.left + offset || scrolledX < offset,
      right: scrolledX + bounding.width > containerRect.right - offset || scrolledX + bounding.width > window.innerWidth - offset,
      top: scrolledY < containerRect.top + offset || scrolledY < offset,
      bottom: scrolledY + bounding.height > containerBottom - offset || scrolledY + bounding.height > window.innerHeight - offset,
    }
  }
}