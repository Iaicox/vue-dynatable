export default {
  name: 'TableWrapper',
  components: {
    TableHeader: () => import('@/components/table/TableHeader'),
    TableContent: () => import('@/components/table/TableContent'),
    TableFooter: () => import('@/components/table/TableFooter'),
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
    items: {
      type: Array,
      default: () => []
    },
    'row-id-key': {
      type: Array,
      default: () => []
    },
    'filter-float': {
      type: Boolean,
      default: false,
    },
    'filter-data': {
      type: Object,
      default: () => ({}),
    },
    'sort-data': {
      type: Object,
      default: () => ({}),
    },

    hoverable: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    'resizable-cols': {
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
    'expand-on-hover': {
      type: Boolean,
      default: false,
    },
    'expand-on-click': {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Number | String,
      default: 1,
    },
    'page-size': {
      type: Number,
      default: 50,
    },

    'table-sizes': {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    orderedHeaders() {
      return this.headers.sort((a, b) => a.position - b.position)
    },
    summary() {
      let obj = {}
      if (this.footer?.calcSum)
        obj = this.items.reduce((obj, item) => {
          this.footer.calcSum.forEach(key => {
            obj[key] += item?.[key] ? +item?.[key] : 0
          })

          return obj
        }, Object.fromEntries(this.footer.calcSum.map(key => [key, 0])))

      return obj
    },
  },
  methods: {
    setSizes(sizes) {
      const table = this.$refs.wrapper.querySelector('table')
      const { width: tableWidth, height: tableHeight } = table.getBoundingClientRect()
      sizes = {
        ...(sizes ?? {}),
        tableWidth,
        tableHeight,
      }
      this.$emit('update:table-sizes', sizes)
    },
  },

  render() {
    const self = this
    const { _c, $scopedSlots: scopedSlots, _props: props, $listeners } = self
    const style = {}
    if (props.loading)
      style.height = 'auto'

    return _c(
      'div',
      {
        staticClass: 'dt--wrapper',
        style,
        ref: 'wrapper',
      },
      [
        self._t(
          `table-slot`,
          function () {
            const children = [
              _c(
                'TableHeader',
                {
                  attrs: {
                    headers: self.orderedHeaders,
                    fixed: props.headerFixed,
                    resizable: props.resizableCols,
                    'sort-data': props.sortData,
                    'filter-data': props.filterData,
                    'filter-float': props.filterFloat,
                    hidden: props.headerHidden,
                  },
                  on: {
                    ...$listeners,
                    'update:table-sizes': self.setSizes,
                    'sort-items': cell => self.$emit('sort-items', cell),
                    'update:sort-data': cell => self.$emit('update:sort-data', cell),
                  },
                  scopedSlots,
                },
              ),
            ]

            if (!props.loading)
              children.push(
                _c(
                  'TableContent',
                  {
                    attrs: {
                      headers: self.orderedHeaders,
                      content: props.content,
                      items: props.items,
                      page: props.page,
                      hoverable: props.hoverable,
                      selectable: props.selectable,
                      'row-id-key': props.rowIdKey,
                      'page-size': props.pageSize,
                      'expand-on-hover': props.expandOnHover,
                      'expand-on-click': props.expandOnClick,
                    },
                    on: {
                      ...$listeners,
                      'update:table-sizes': () => {},
                      'sort-items': cell => self.$emit('sort-items', cell),
                      'update:sort-data': cell => self.$emit('update:sort-data', cell),
                    },
                    scopedSlots,
                  },
                ),
                _c(
                  'TableFooter',
                  {
                    attrs: {
                      headers: self.orderedHeaders,
                      content: props.content,
                      footer: props.footer,
                      summary: self.summary,
                      hidden: props.footerHidden,
                      'expand-on-click': props.expandOnClick,
                    },
                    on: {
                      ...$listeners,
                      'update:table-sizes': self.setSizes,
                      'sort-items': cell => self.$emit('sort-items', cell),
                      'update:sort-data': cell => self.$emit('update:sort-data', cell),
                    },
                    scopedSlots,
                  },
                ),
              )

            return [
              _c(
                'table',
                {
                  staticClass: 'dt--table',
                },
                children,
                2
              )
            ]
          },
          null,
          props,
        ),
      ],
      2
    )
  },
}