//  Helpers
import { FixChildrenOrder } from '@/middleware/helpers'

export default {
  name: 'TableHeader',
  components: {
    TableRow: () => import('@/components/table/TableRow'),
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    'sort-data': {
      type: Object,
      default: () => ({}),
    },
    'filter-float': {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      resizeOptions: {
        startPoint: 0,
        startWidth: 0,
        resizing: false,
        resizable: false,
        isPrev: undefined,
        isParent: undefined,
        items: null,
        precents: {},
        target: null,
      },
    }
  },
  computed: {
    visibleHeaders() {
      return this.headers.filter(el =>
        typeof el.hidden !== 'undefined'
          ? !el.hidden
          : typeof el.default !== 'undefined'
            ? !el.default
            : true
      )
    },
  },
  methods: {
    dragover(e) {
      e.preventDefault()
    },
    drop({event, valueTo, valueToIsParent}) {
      event.dataTransfer.dropEffect = 'move'
      const headers = [...this.headers]
      const valueFromIsParent = JSON.parse(event.dataTransfer.getData('valueFromIsParent'))
      const valueFrom = event.dataTransfer.getData('valueFrom')
      const keys = {
        from: valueFromIsParent ? 'parent' : 'value',
        to: valueToIsParent ? 'parent' : 'value',
      }
      const indexFrom = headers.findIndex(el => el[keys.from] === valueFrom)
      const indexTo = headers.findIndex(el => el[keys.to] === valueTo)
      if (indexTo === -1 || indexFrom === -1 || indexTo === indexFrom || !headers[indexTo].draggable)
        return false

      headers.forEach(header => {
        if (header[keys.from] === valueFrom)
          header.order = indexTo
        if (header[keys.to] === valueTo)
          header.order = indexFrom
      })

      FixChildrenOrder(headers)
      this.$emit('update:headers', headers)
    },

    checkCursor({event, target, value, isParent}) {
      if (this.resizeOptions.resizing)
        return

      this.clearResizeState()

      let key = isParent ? 'parent' : 'value'
      const {x: pointX, y: pointY} = event
      const {x: cellX, y: cellY, height, width} = target.getBoundingClientRect()
      this.resizeOptions.isPrev = pointX >= cellX + width - 4
        ? false
        : pointX <= cellX + 4
          ? true
          : void 0

      const element = document.elementsFromPoint(this.resizeOptions.isPrev ? (event.x - 10) : event.x, event.y).find(el => el.classList.contains('dt--cell'))
      this.resizeOptions.target = element
      this.resizeOptions.isParent = element ? (element.colSpan === 1 ? false : true) : isParent

      if (this.resizeOptions.isPrev === true) {
        const index = this.headers.findIndex(el => el[key] === value) - 1
        if (index > -1) {
          const item = this.headers[index]
          this.resizeOptions.items = this.resizeOptions.isParent
            ? this.headers.filter(el => el.parent === item.parent)
            : [item]
        }
      } else if (this.resizeOptions.isPrev === false) {
        key = this.resizeOptions.isParent ? 'parent' : 'value'
        this.resizeOptions.items = this.resizeOptions.isParent
          ? this.headers.filter(el => el[key] === value)
          : [this.headers.find(el => el[key] === value)]
      }
      const resizeAvailable = this.resizeOptions.items?.every(el => (el.resizable !== false || this.resizable) && !['actions', 'row_order'].includes(el.value))

      if (
        pointY >= cellY &&
        pointY <= cellY + height &&
        this.resizeOptions.isPrev !== undefined &&
        resizeAvailable
      )
        this.resizeOptions.resizable = true
      else
        this.resizeOptions.resizable = false
    },
    startResize(event) {
      if (!this.resizeOptions.resizable)
        return

      event.preventDefault()
      event.stopPropagation()

      const targetRect = this.resizeOptions.target.getBoundingClientRect()
      this.resizeOptions.resizing = true
      this.resizeOptions.startPoint = event.x
      this.resizeOptions.startWidth = targetRect.width

      this.resizeOptions.precents = {}
      const defaultFullWidth = this.resizeOptions.items.reduce((sum, el) => sum += +parseFloat(el.width), 0)
      this.resizeOptions.items.forEach(el => {
        const width = +parseFloat(el.width)
        const percent = width / defaultFullWidth
        this.resizeOptions.precents[`id-${el.value}`] = percent
        el.width = `${this.resizeOptions.startWidth * percent}px`
      })

      document.addEventListener('mouseup', this.finishResize)
      document.addEventListener('mousemove', this.resizeCol, false)
    },
    resizeCol(event){
      const dx = event.x - this.resizeOptions.startPoint
      this.resizeOptions.startPoint = event.x
      this.resizeOptions.startWidth += dx

      this.resizeOptions.items.forEach(el => {
        el.width = `${this.resizeOptions.startWidth * this.resizeOptions.precents[`id-${el.value}`]}px`
      })
      this.$emit('update:headers', this.headers)
    },
    finishResize() {
      document.removeEventListener('mousemove', this.resizeCol, false)
      document.removeEventListener('mouseup', this.finishResize)
      this.clearResizeState()
      this.$emit('update:headers', this.headers)
    },
    clearResizeState() {
      this.resizeOptions.startPoint = 0
      this.resizeOptions.startWidth = 0
      this.resizeOptions.resizing = false
      this.resizeOptions.resizable = false
      this.resizeOptions.isPrev = undefined
      this.resizeOptions.isParent = undefined
      this.resizeOptions.items = null
      this.resizeOptions.precents = {}
      this.resizeOptions.target = null
    },

    setSizes(sizes) {
      const header = this.$refs.thead
      const { width: headerWidth, height: headerHeight } = header.getBoundingClientRect()
      sizes = {
        ...(sizes ?? {}),
        headerWidth,
        headerHeight,
      }
      this.$emit('update:table-sizes', sizes)
    },
  },
  mounted() {
    this.setSizes()
  },

  render() {
    const self = this
    const { _c, _props: props, $scopedSlots: scopedSlots, $listeners } = self

    return _c(
      'thead',
      {
        staticClass: 'dt--header',
        class: {
          sticky_row: props.fixed,
          resizable: self.resizeOptions.resizable,
        },
        on: {
          dragover: self.dragover,
        },
        ref: 'thead',
      },
      [
        self._t(
          `header-slot`,
          function () {
            const children = []
            if (!props.hidden) {
              if (self.visibleHeaders.some(el => el.hasOwnProperty('parent'))) {
                const parents = []
                const bottomRow = []
                const topRow = self.visibleHeaders.reduce((arr, el) => {
                  el = {...el}

                  if (el.hasOwnProperty('parent')) {
                    const find = arr.find(item => item.title === el.parent)
                    if (find) {
                      find.colspan++
                      const findBotEl = bottomRow.find(item => item.some(obj => obj.parent === el.parent))
                      findBotEl.push(el)
                    } else {
                      const i = 3 + parents.length % 3
                      parents.push(1)
                      arr.push({
                        title: el.parent,
                        colspan: 1,
                        classHeader: `olliver lighten-${i}`,
                        width: '',
                        position: el.position,
                        prependBtn: false,
                        appendBtn: false,
                        sortable: false,
                        resizable: false,
                        draggable: false,
                        header: true,
                      })
                      bottomRow.push([el])
                    }
                  } else {
                    el.rowspan = 2
                    arr.push(el)
                  }
                  return arr
                }, [])

                topRow
                  .filter(header => header.header)
                  .forEach(header => {
                    const children = bottomRow.flat().filter(child => child.parent === header.title)
                    if (children.length) {
                      header.resizable = children.some(child => child.resizable)
                      header.draggable = children.every(child => child.draggable)
                      children.forEach(child => child.draggable = !header.draggable)
                    }
                  })

                children.push(
                  _c(
                    'TableRow',
                    {
                      attrs: {
                        tag: 'tr',
                        headers: topRow,
                        type: 'header',
                        'header-fixed': props.fixed,
                        'header-hidden': props.hidden,
                        'sort-data': props.sortData,
                      },
                      on: {
                        ...$listeners,
                        'update:table-sizes': self.setSizes,

                        'drop-to-header': self.drop,
                        'cell-resize': self.startResize,
                        'check-resize': self.checkCursor,
                        'sort-items': cell => self.$emit('sort-items', cell),
                        'update:sort-data': cell => self.$emit('update:sort-data', cell),
                      },
                      scopedSlots,
                    },
                  ),
                  _c(
                    'TableRow',
                    {
                      attrs: {
                        tag: 'tr',
                        headers: bottomRow.flat(),
                        type: 'header',
                        'header-fixed': props.fixed,
                        'header-hidden': props.hidden,
                        'sort-data': props.sortData,
                      },
                      on: {
                        ...$listeners,
                        'update:table-sizes': self.setSizes,

                        'drop-to-header': self.drop,
                        'cell-resize': self.startResize,
                        'check-resize': self.checkCursor,
                        'sort-items': cell => self.$emit('sort-items', cell),
                        'update:sort-data': cell => self.$emit('update:sort-data', cell),
                      },
                      scopedSlots,
                    },
                  )
                )
              } else {
                children.push(_c(
                  'TableRow',
                  {
                    attrs: {
                      tag: 'tr',
                      headers: self.visibleHeaders,
                      type: 'header',
                      'header-fixed': props.fixed,
                      'header-hidden': props.hidden,
                      'sort-data': props.sortData,
                    },
                    on: {
                      ...$listeners,
                      'update:table-sizes': self.setSizes,

                      'drop-to-header': self.drop,
                      'cell-resize': self.startResize,
                      'check-resize': self.checkCursor,
                      'sort-items': cell => self.$emit('sort-items', cell),
                      'update:sort-data': cell => self.$emit('update:sort-data', cell),
                    },
                    scopedSlots,
                  },
                ))
              }
            }
            return children
          },
          null,
          props,
        ),
      ],
      2
    )
  },
}