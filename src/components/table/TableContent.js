import { CheckUnicByKeysArr } from '@/middleware/helpers'

export default {
  name: 'TableContent',
  components: {
    TableRow: () => import('@/components/table/TableRow'),
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    content: {
      type: Object,
      default: () => ({})
    },
    hoverable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: true,
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
    'row-id-key': {
      type: String | Array,
      default: () => []
    },

    page: {
      type: Number | String,
      default: 1,
    },
    'page-size': {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      chosenItem: {},
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
    getCompareArrStr(item) {
      return this.rowIdKey.map(key => item[key]).join('_')
    },
  },

  render() {
    const self = this
    const { _c, _props: props, $scopedSlots: scopedSlots, $listeners } = self

    return _c(
      'tbody',
      {
        staticClass: 'dt--content',
      },
      [
        self._t(
          `content-slot`,
          function () {
            const rowsCountable = self.visibleHeaders.find(el => el.value === 'row_order')
            const children = []
            props.items.forEach((item, i) => {
              children.push(_c(
                'TableRow',
                {
                  class: {
                    hoverable: props.hoverable,
                    expand_on_hover: props.expandOnHover,
                    single_line: !props.wrapLine ? (props.expandOnClick && !CheckUnicByKeysArr(self.chosenItem, item, self.rowIdKey)) : !props.wrapLine,
                    wrap_line: props.wrapLine ? props.wrapLine : (props.expandOnClick && CheckUnicByKeysArr(self.chosenItem, item, self.rowIdKey)),
                    active: CheckUnicByKeysArr(self.chosenItem, item, self.rowIdKey),
                  },
                  attrs: {
                    tag: 'tr',
                    item: item,
                    headers: self.visibleHeaders,
                    content: props.content,
                    type: 'content',
                    hoverable: props.hoverable,
                    selectable: props.selectable,
                    'expand-on-hover': props.expandOnHover,
                    'expand-on-click': props.expandOnClick,
                    'wrap-line': props.wrapLine,
                    'row-order': rowsCountable
                      ? (props.pageSize * (props.page - 1) + i + 1)
                      : 0,
                    page: props.page,
                    'page-size': props.pageSize,
                    selected: CheckUnicByKeysArr(self.chosenItem, item, self.rowIdKey),
                    'row-id-key': props.rowIdKey,
                  },
                  on: {
                    ...$listeners,
                    'item-select': () => {
                      if (self.selectable) {
                        if (CheckUnicByKeysArr(self.chosenItem, item, self.rowIdKey))
                          self.chosenItem = {}
                        else
                          self.chosenItem = item

                        self.$emit('item-select', self.chosenItem)
                      }
                    },
                  },
                  scopedSlots,
                  key: self.getCompareArrStr(item),
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