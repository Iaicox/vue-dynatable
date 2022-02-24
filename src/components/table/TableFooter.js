export default {
  name: 'Tablesummary',
  components: {
    TableRow: () => import('@/components/table/TableRow'),
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    content: {
      type: Object,
      default: () => ({})
    },
    footer: {
      type: Object,
      default: () => ({})
    },
    summary: {
      type: Object,
      default: () => ({})
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    'expand-on-click': {
      type: Boolean,
      default: false,
    },
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
    setSizes(sizes) {
      const footer = this.$refs.tfoot
      const { width: footerWidth, height: footerHeight } = footer.getBoundingClientRect()
      sizes = {
        ...(sizes ?? {}),
        footerWidth,
        footerHeight,
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
      'tfoot',
      {
        staticClass: 'dt--footer',
        class: {
          sticky_row: props.fixed,
        },
        ref: 'tfoot',
      },
      [
        self._t(
          `footer-slot`,
          function () {
            const children = []
            if (!props.hidden)
              children.push(_c(
                'TableRow',
                {
                  class: {},
                  attrs: {
                    tag: 'tr',
                    headers: self.visibleHeaders,
                    content: props.content,
                    footer: props.footer,
                    summary: props.summary,
                    type: 'footer',
                    'footer-fixed': props.fixed,
                    'footer-hidden': props.hidden,
                    'expand-on-click': props.expandOnClick,
                  },
                  on: {
                    ...$listeners,
                    'update:table-sizes': self.setSizes,
                  },
                  scopedSlots,
                },
              ))
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