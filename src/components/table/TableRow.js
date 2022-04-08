//  Helpers
import { CollectClasses } from '@/middleware/helpers'

export default {
  name: 'TableRow',
  components: {
    TableHeaderCell: () => import('@/components/table/TableHeaderCell'),
    TableContentCell: () => import('@/components/table/TableContentCell'),
    TableFooterCell: () => import('@/components/table/TableFooterCell'),
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    content: {
      type: Object,
      default: () => ({})
    },
    footer: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'content'
    },
    summary: {
      type: Object,
      default: () => ({}),
    },
    classRow: {
      type: String | Array | Object | Function,
      default: '',
    },

    hoverable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    'expand-on-hover': {
      type: Boolean,
      default: false,
    },
    'expand-on-click': {
      type: Boolean,
      default: false,
    },
    'wrap-line': {
      type: Boolean,
      default: false,
    },
    'header-fixed': {
      type: Boolean,
      default: true,
    },
    'header-hidden': {
      type: Boolean,
      default: false,
    },
    'footer-fixed': {
      type: Boolean,
      default: true,
    },
    'footer-hidden': {
      type: Boolean,
      default: false,
    },
    'row-order': {
      type: Number,
      default: 0,
    },
    'row-id-key': {
      type: String | Array,
      default: () => []
    },
    'sort-data': {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    currentComponent() {
      switch (this.type) {
        case 'header':
          return 'TableHeaderCell'
        case 'footer':
          return 'TableFooterCell'
        default:
          return 'TableContentCell'
      }
    },
  },
  methods: {
    internalData(cell) {
      const obj = {}

      switch (this.type) {
        case 'header':
          Object.assign(obj, cell)
          obj.sortDirection = this.sortData?.[cell?.value] ?? ''
          break
        case 'footer':
          obj.summary = this.summary
          obj.value = cell.value
          obj.title = cell.title
          obj.width = cell.width
          obj.position = cell.position
          obj.classCell = cell.classCell
          obj.alignCell = cell.alignCell
          obj.visible = cell.visible
          obj.singleLine = ((cell.singleLine ?? true) && !this.selected && this.expandOnClick) || ((cell.singleLine ?? true) && !this.expandOnClick)
          Object.assign(obj, (this.content?.[cell?.value] ?? {}))
          break

        default:
          Object.assign(obj, (this?.[this.type]?.[cell?.value] ?? {}))
          obj.value = cell.value
          obj.title = cell.title
          obj.width = cell.width
          obj.position = cell.position
          obj.item = this.item
          obj.classCell = cell.classCell
          obj.alignCell = cell.alignCell
          obj.groupable = cell.groupable
          obj.sortable = cell.sortable
          obj.selected = cell.selected
          obj.singleLine = (!this.wrapLine || cell.singleLine) && ((!this.selected && this.expandOnClick) || !this.expandOnClick)
          // obj.singleLine = ((cell.singleLine ?? true) && !this.selected && this.expandOnClick) || ((cell.singleLine ?? true) && !this.expandOnClick)
          obj.visible = cell.visible
          obj.clickOnHover = cell.clickOnHover
          obj.clickOnHoverIcon = cell.clickOnHoverIcon
          obj.clickOnHoverEvent = cell.clickOnHoverEvent
          obj.prependBtn = cell.prependBtn
          obj.prependBtnHoverable = cell.prependBtnHoverable
          obj.prependBtnIcon = cell.prependBtnIcon
          obj.prependBtnEvent = cell.prependBtnEvent
          obj.appendBtn = cell.appendBtn
          obj.appendBtnHoverable = cell.appendBtnHoverable
          obj.appendBtnIcon = cell.appendBtnIcon
          obj.appendBtnEvent = cell.appendBtnEvent
      }
      return obj
    },
  },
  mounted() {
    if (['header', 'footer'].includes(this.type))
      setTimeout(() => {
        this.$emit('update:table-sizes')
      }, 100)
  },

  render() {
    const self = this
    const { _c, $scopedSlots: scopedSlots, _props: props, $listeners } = self

    return _c(
      'tr',
      {
        staticClass: 'dt--row',
        class: {
          ...CollectClasses(props.classRow, props),
        },
        on: {
          click: () => {
            if (self.type === 'content' && self.selectable)
              self.$emit('item-select', props.item)
          }
        },
      },
      [
        self._t(
          `${props.type}-row`,
          function () {
            const children = []

            props.headers.forEach(cell => {
              if (cell.value === 'row_order')
                children.push(_c(
                  self.currentComponent,
                  {
                    attrs: {
                      ...self.internalData({
                        value: 'row_order',
                        title: cell.title ?? '№',
                        width: cell.width ?? '30px',
                        classCell: cell.classCell ?? 'center',
                        alignCell: cell.alignCell ?? 'center',
                        'append-btn': false,
                        rowspan: props.headers.some(el => el.rowspan > 1) ? 2 : 1,
                      }),
                      'row-order': props.rowOrder,
                    },
                    on: {
                      ...$listeners,
                      'item-context': cell => self.$emit('item-context', {
                        ...props,
                        ...cell,
                      }),
                      'header-context': cell => self.$emit('header-context', {
                        ...props,
                        ...cell,
                      }),
                      'footer-context': cell => self.$emit('footer-context', {
                        ...props,
                        ...cell,
                      }),
                    },
                    scopedSlots,
                    key: `row_order`,
                  },
                ))
              else if (cell.value === 'actions')
                children.push(_c(
                  self.currentComponent,
                  {
                    attrs: {
                      ...self.internalData({
                        value: 'actions',
                        isIcon: cell.isIcon ?? true,
                        icon: cell.icon ?? 'cog-outline',
                        title: cell.icon ?? '',
                        width: cell.width ?? '60px',
                        classCell: cell.classCell ?? '',
                        alignCell: cell.alignCell ?? 'center',
                        'append-btn': false,
                        'prepend-btn': false,
                        draggable: false,
                        resizable: false,
                        sortable: false,
                        rowspan: props.headers.some(el => el.rowspan > 1) ? 2 : 1,
                      }),
                      'action-btns': cell.btns,
                    },
                    on: {
                      ...$listeners,
                      'item-context': cell => self.$emit('item-context', {
                        ...props,
                        ...cell,
                      }),
                      'header-context': cell => self.$emit('header-context', {
                        ...props,
                        ...cell,
                      }),
                      'footer-context': cell => self.$emit('footer-context', {
                        ...props,
                        ...cell,
                      }),
                      ...cell.btns.reduce((obj, btn) => {
                        if (btn.cb && self.currentComponent === 'TableContentCell')
                          obj[btn.event] = () => btn.cb({
                            'row-order': props.rowOrder,
                            item: props.item,
                            ...(btn.args ?? {}),
                          })
                        btn
                        return obj
                      }, {})
                    },
                    scopedSlots,
                    key: `actions`,
                  },
                ))
              else
                children.push(_c(
                  self.currentComponent,
                  {
                    attrs: {
                      ...self.internalData(cell),
                    },
                    on: {
                      ...$listeners,
                      'item-context': cell => self.$emit('item-context', {
                        ...props,
                        ...cell,
                      }),
                      'header-context': cell => self.$emit('header-context', {
                        ...props,
                        ...cell,
                      }),
                      'footer-context': cell => self.$emit('footer-context', {
                        ...props,
                        ...cell,
                      }),
                      'sort-items': cell => {
                        self.$emit('update:sort-data', cell)
                        self.$emit('sort-items', cell)
                      },
                    },
                    scopedSlots,
                    key: `${cell.value}_${cell.width}`,
                  },
                ))
            })
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