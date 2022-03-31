//  Styles
import Icons from '@/assets/icons'
import cssVars from '@/assets/styles/_export.scss'
//  Helpers
import { FixChildrenOrder, getSortDirection, toNumber, isObjEmpty, calcWidth, uniteObj } from '@/middleware/helpers'
//  Vue
import Vue from 'vue'
import tooltipDirective from '@/middleware/directives/tooltip.directive'
import outsideClickDirective from '@/middleware/directives/outside-click.directive'
Vue.directive('tooltip', tooltipDirective)
Vue.directive('click-outside', outsideClickDirective)

export default {
  name: 'TableContainer',
  components: {
    TableWrapper: () => import('@/components/table/TableWrapper'),
    BaseFilter: () => import('@/components/filter/BaseFilterContent'),
    Pagination: () => import('@/components/BaseComponentPagination'),
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
      type: String | Array,
      default: () => []
    },
    'multiple-sort': {
      type: Boolean,
      default: false,
    },
    'filter-float': {
      type: Boolean,
      default: false,
    },
    'filter-float-position': {
      type: String,
      default: 'bottom-right',
    },
    'filter-data': {
      type: Object,
      default: () => ({}),
    },
    'filter-settings': {
      type: Object,
      default: () => ({}),
    },
    'custom-filter': {
      type: Function | null,
      default: null,
    },
    'force-filter-items': {
      type: Boolean,
      default: false,
    },
    'sort-data': {
      type: Object,
      default: () => ({}),
    },
    'custom-sort': {
      type: Function | null,
      default: null,
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
    'page-size-computable': {
      type: Boolean,
      default: false,
    },
    'recalc-cols-width': {
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

    loading: {
      type: Boolean,
      default: false,
    },
    'loading-text': {
      type: String,
      default: 'Загрузка...',
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    page: {
      type: Number | String,
      default: 1,
    },
  },
  data() {
    return {
      $rowIdKey: [],
      tableSizes: {
        width: 0,
        height: 0,
        tableWidth: 0,
        tableHeight: 0,
        headerHeight: this.headerHidden ? 0 : 0,
        headerWidth: this.headerHidden ? 0 : 0,
        footerHeight: this.footerHidden ? 0 : 0,
        footerWidth: this.footerHidden ? 0 : 0,
        contentWidth: 0,
        get contentHeight() {
          return this.height - this.headerHeight - this.footerHeight
        }
      },

      $headers: [],
      sortOrder: {},
      $filterData: {},
      $filterSettings: {
        opened: false,
      },
      $filterColsCount: 1,
      filteredItems: [],
      sortedItems: [],

      $loading:  {
        state: false,
        text: '',
      },
      $pagination: {
        length: 0,
        value: 1,
        size: 50,
        'prev-label': 'Назад',
        'next-label': 'Вперед',
      },
    }
  },
  watch: {
    rowIdKey: {
      handler() {
        if (typeof this.rowIdKey === 'string')
          this.$data.$rowIdKey = [this.rowIdKey]
        else if (Array.isArray(this.rowIdKey))
          this.$data.$rowIdKey = this.rowIdKey
        else
          console.warn('rowIdKey должен быть строкой либо массивом!')
      },
      immediate: true,
      deep: true,
    },

    tableSizes: {
      handler(n, o) {
        if (n.width !== o?.width)
          this.reCalcColsWidth()
        if (
          n.height !== o?.height ||
          !this.headerHidden && n.headerHeight !== o?.headerHeight ||
          !this.footerHidden && n.footerHeight !== o?.footerHeight
        )
          this.reCalcRowsCount()
      },
      immediate: true,
      deep: true,
    },

    headers: {
      handler() {
        this.$set(this.$data, '$headers', this.headers)
        this._updateTableSize()
      },
      immediate: true,
      deep: true,
    },

    sortData: {
      handler() {
        this.$set(this, 'sortOrder', {
          ...this.sortOrder,
          ...this.sortData,
        })
        this.sortItems()
      },
      deep: true,
      immediate: true,
    },

    multipleSort: {
      handler() {
        this.sortOrder = {}
        this.sortItems()
      },
    },

    forceFilterItems: {
      handler() {
        this.filterItems()
        this.sortItems()
      },
    },

    filterSettings: {
      handler() {
        this.$set(this.$data.$filterSettings, 'colsCount', +this.filterSettings?.colsSettings + (this.filterSettings?.position?.length || 1))
        this.$set(this.$data, '$filterSettings', {
          opened: false,
          ...this.$data.$filterSettings,
          ...this.filterSettings,
        })
      },
      deep: true,
      immediate: true,
    },
    filterData: {
      handler() {
        this.$set(this.$data, '$filterData', {
          ...this.$data.$filterData,
          ...this.filterData,
        })

        this.filterItems()
      },
      deep: true,
      immediate: true,
    },

    items: {
      handler(n, o) {
        if (this.filterSettings.getDataFromItems !== false)
          Object.entries(this.filterData).forEach(([type, block]) => {
            Object.entries(block).forEach(([key, options]) => {
              if (this.checkIfNeedFilterData({type, key, options}) || n?.length !== o?.length)
                this.getFilterData(type, key)
            })
          })

        this.definePagination()
        this.filterItems()
        this.sortItems()
      },
      deep: true,
      immediate: true,
    },

    loading: {
      handler() {
        this.$data.$loading.state = this.loading
      },
      immediate: true,
    },
    loadingText: {
      handler() {
        this.$data.$loading.text = this.loadingText
      },
      immediate: true,
    },
    pagination: {
      handler() {
        this.definePagination()
      },
      deep: true,
      immediate: true,
    },
    page: {
      handler() {
        this.definePagination()
      },
      immediate: true,
    },
  },
  computed: {
    currentItems() {
      const start = this.$data.$pagination.size * (this.$data.$pagination.value - 1)
      return isNaN(start) ? [] : this.sortedItems.slice(start, start + this.$data.$pagination.size)
    },

    localSaveId() {
      return (this.filterSettings?.saveId ?? this.$route?.name ?? 'TableContainerFilter') + `-FilterData`
    },

    loadingTextArr() {
      return (this.$data.$loading.text || '').split('')
    },
  },
  methods: {
    _updateTableSize(sizes) {
      const node = this.$refs.wrapper
      if (!node)
        return

      const { width, height } = node.$el.getBoundingClientRect()
      sizes = {
        ...(sizes ?? {}),
        width,
        height,
      }
      this.$set(this, 'tableSizes', {
        ...this.tableSizes,
        ...sizes,
        get contentHeight() {
          return this.height - this.headerHeight - this.footerHeight
        },
      })
      this.$emit('update:table-sizes', this.tableSizes)
    },
    definePagination() {
      const length = Math.ceil(this.filteredItems.length / this.$data.$pagination.size)
      this.$set(this.$data, '$pagination', {
        ...this.$data.$pagination,
        ...this.pagination,
        value: this.page,
        length,
      })
    },

    checkIfNeedFilterData({type, key, options}) {
      switch (type) {
        case 'select':
          if (
            options.items.length &&
            options.itemName === this.$data.$filterData[type][key].itemName &&
            options.itemId === this.$data.$filterData[type][key].itemId
          )
            return false
          else
            return true

        case 'radio':
        case 'checkbox':
          if (options.items.length)
            return false
          else
            return true

        case 'date':
        case 'search':
        case 'switcher':
          return false

        case 'range':
          if (!options.max || options.max === options.min)
            return true
          else
            return false
      }
    },
    getFilterData(type, key) {
      this.$data.$filterData[type] = this.$data.$filterData[type] ?? {}
      this.$data.$filterData[type][key] = this.$data.$filterData[type][key] ?? {}
      const options = this.$data.$filterData[type][key]
      switch (type) {
        case 'checkbox':
        case 'radio':
          options.items = [...new Set(this.items.map(el => el[key]))].map(value => ({ value, label: value }))
          break
        case 'select':
          const name = options.itemName ?? options.itemId ?? 'name'
          options.items = [...new Set(this.items.map(el => el[key]))].map(value => ({ [name]: value }))
          break
        case 'range':
          const items = this.items.map(el => el[key])
          options.max = Math.max(items)
          options.min = Math.min(items)
          break
        case 'switcher':
        case 'date':
        case 'search':
          break
      }
    },

    setTableWidth() {
      const table = this.$refs.wrapper?.$el?.querySelector('table')

      if (table)
        table.style.width = `${this.tableSizes.tableWidth}px`
    },

    reCalcColsWidth() {
      let balanceForAuto = this.tableSizes.width
      const tableWidth = this.tableSizes.width
      const auto = []
      const orderedItems = this.headers.filter(item => item.order == 0 || item.order)
      const unorderedItems = this.headers.filter(item => item.order != 0 && !item.order)
      const newHeaders = this.headers.map((el, i) => {
        const ind = orderedItems.findIndex(header => +header.order == i)
        let item
        if (ind > -1)
          item = orderedItems.splice(ind, 1)[0]
        else
          item = unorderedItems.shift()

        item = {
          ...item,
          order: i,
        }

        if (!this.recalcColsWidth || !this.tableSizes.width)
          return item

        if (item.width === 'auto' || !item.width)
          auto.push(item)
        else {
          if (item.width.includes('%') || !isNaN(item.width)) {
            const width = (tableWidth * parseFloat(item.width) / 100).toFixed(2)
            balanceForAuto -= width
            item.width = width + 'px'
          }
          if (item.width.includes('px'))
            balanceForAuto -= parseFloat(item.width)
          if (item.prependBtn && parseInt(item.width) < 60)
            item.width = +parseInt(item.width) + 25 + 'px'
          if (item.appendBtn && parseInt(item.width) < 60)
            item.width = +parseInt(item.width) + 25 + 'px'
        }

        return item
      })

      FixChildrenOrder(newHeaders)

      const autoWidth = (balanceForAuto / auto.length).toFixed(2)
      auto.forEach(header => {
        header.width = autoWidth + 'px'
        if (header.prependBtn && parseInt(header.width) < 60)
          header.width = +parseInt(header.width) + 25 + 'px'
        if (header.appendBtn && parseInt(header.width) < 60)
          header.width = +parseInt(header.width) + 25 + 'px'
      })
      this.$emit('update:headers', [...newHeaders])
    },
    reCalcRowsCount() {
      if (!this.pageSizeComputable)
        return

      const rowHeight = 31
      const tableContentHeight = this.tableSizes.contentHeight
      const count =  Math.floor(tableContentHeight / rowHeight)
      this.$set(this.$data.$pagination, 'size', count > 0 ? count : 1)
      this.definePagination()
    },

    saveLocally() {
      const json = JSON.stringify(this.$data.$filterData)
      localStorage.setItem(this.localSaveId, json)
    },
    // !!! Дописать для остальных типов
    filterItems() {
      if (this.customFilter)
        this.filteredItems = this.items.filter(item => this.customFilter(item, this.$data.$filterData))
      else
        this.filteredItems = this.items.filter(item => {
          let check = true
          Object.entries(this.$data.$filterData).forEach(([type, value]) => {
            if (!check)
              return

            if (type === 'search') {
              if (value.searchField)
                check = value.byItems.some(key => ~String(item[key]).indexOf(value.searchField))
              return
            }

            if (type === 'select') {
              check = Object
                .entries(value)
                .filter(([key, options]) => options.selected.length)
                .every(([key, options]) => options.selected.some(selected => item[key] === selected[options.itemId ?? options.itemName ?? 'name']))
              return
            }

            // check = Object.entries(value).every(([key, options]) => {
            //   if (!check)
            //     return

            //   switch (type) {
            //     case 'select':
            //       if (options.selected.length)
            //         check = options.selected.some(selected => String(selected).toLowerCase() === String(item[key]).toLowerCase())
            //       break
            //   }
            // })
          })

          return check
        })

      this.definePagination()
      if (this.$data.$pagination.value !== 1) {
        this.$data.$pagination.value = 1
        this.$emit('update:page', 1)
      }

      this.sortItems()

      this.$emit('filter-items', this.filteredItems)
    },
    sortItems() {
      this.sortedItems = [...this.filteredItems]
      const collator = new Intl.Collator('ru', {
        numeric: true,
        caseFirst: 'upper',
        sensitivity: 'case',
      })

      if (!isObjEmpty(this.sortOrder))
        if (this.customSort)
          this.sortedItems.sort((a, b) => this.customSort(a, b, this.sortOrder))
        else
          this.sortedItems.sort((a, b) => {
            return Object
              .entries(this.sortOrder)
              .reduce((state, [key, dir]) => {
                const multiplier = dir === 'ascending' ? 1 : -1
                if (!state)
                  state = multiplier * collator.compare(String(toNumber(a[key])), String(toNumber(b[key])))
                return state
              }, 0)
          })

      this.$emit('sort-items', this.filteredItems)
    },
  },

  created() {
    window.addEventListener('resize', this._updateTableSize)
    this._updateTableSize()
    this.$on('update:headers', async headers => {
      await this.$nextTick(() => {
        this.$set(this.$data, '$headers', headers)
      })
    })
    this.$on('update:filter-data', options => {
      this.$set(this.$data, '$filterData', {
        ...this.$data.$filterData,
        ...options,
      })
    })
    this.$on('force-filter-items', () => {
      if (this.$data.$filterSettings?.needLocalSaving)
        this.saveLocally()
      this.filterItems()
    })
    this.$on('update:filter-settings', options => {
      this.$set(this.$data, '$filterSettings', {
        ...this.$data.$filterSettings,
        ...options,
      })
    })
    this.$on('update:loading', state => {
      this.$data.$loading.state = state
    })
    this.$on('update:loading-text', text => {
      this.$data.$loading.text = text
    })

    if (this.filterSettings?.needLocalSaving) {
      const json = JSON.parse(localStorage.getItem(this.localSaveId))
      if (json)
        this.$nextTick(() => {
          const paths = []
          Object.keys(json).map(type => {
            Object.keys(json[type]).map(key => {
              if (type !== 'search')
                paths.push(`${type}.${key}.selected`)
            })
          })
          const data = uniteObj(this.filterData, json, paths)
          if (data.select)
            Object.values(data.select).forEach(options => {
              if (options.selected.length)
                if (
                  options.items.length &&
                  !Object.keys(options.selected[0]).some(key => Object.keys(options.items[0]).includes(key))
                )
                  options.selected = []
            })

          this.$emit('update:filter-data', data)
          this.$nextTick(() => this.filterItems())
        })
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._updateTableSize)
  },

  render() {
    const self = this
    const { _c, $scopedSlots: scopedSlots, _props: props, $listeners } = self

    return _c(
      'div',
      {
        staticClass: 'dt dt--container',
      },
      [
        self._t(
          `content.prepend`,
          [],
          null,
          props,
        ),
        self._t(
          `table.prepend`,
          [],
          null,
          props,
        ),
        _c(
          `TableWrapper`,
          {
            attrs: {
              headers: self.$data.$headers,
              content: props.content,
              footer: props.footer,
              items: self.currentItems,
              'row-id-key': self.$data.$rowIdKey,
              hoverable: props.hoverable,
              selectable: props.selectable,
              'resizable-cols': props.resizableCols,
              'header-fixed': props.headerFixed,
              'header-hidden': props.headerHidden,
              'footer-fixed': props.footerFixed,
              'footer-hidden': props.footerHidden,
              'sort-data': self.$data.sortOrder,
              'filter-data': self.$data.$filterData,
              'filter-float': props.filterFloat,

              loading: self.$data.$loading.state,
              page: props.page,
              'page-size': self.$data.$pagination.size,

              'expand-on-hover': props.expandOnHover,
              'expand-on-click': props.expandOnClick,

              'table-sizes': self.tableSizes,
            },
            on: {
              ...$listeners,
              'update:filter-data': options => self.$emit('update:filter-data', options),
              'update:filter-settings': options => self.$emit('update:filter-settings', options),
              'update:sort-data': cell => {
                if (props.multipleSort)
                  self.$data.sortOrder[cell.value] = getSortDirection(self.$data.sortOrder[cell.value])
                else
                  self.$data.sortOrder = {[cell.value]: getSortDirection(self.$data.sortOrder[cell.value])}

                if (!self.$data.sortOrder[cell.value])
                  delete self.$data.sortOrder[cell.value]

                self.$set(self, 'sortOrder', {
                  ...self.sortOrder,
                  ...self.sortData,
                })
                self.$emit('update:sort-data', self.$data.sortOrder)
              },
              'sort-items': () => self.sortItems(),
              'update:table-sizes': self._updateTableSize,
              'update:headers': headers => self.$emit('update:headers', headers),
            },
            scopedSlots,
            ref: 'wrapper',
          },
        ),
        self._t(
          `filter-float`,
          function () {
            const arr = []
            if (!props.filterFloat)
              return arr

            const ctxOpts = {
              attrs: {},
              on: {
                'update:filter-data': options => {
                  self.$emit('update:filter-data', options)

                  if (self.$data.$filterSettings?.filterOnChange)
                    self.$emit('force-filter-items')
                },
                'update:cols-items': items => self.$emit('update:headers', items),
                'filter-items': () => self.$emit('force-filter-items'),
              },
            }
            const btnStyle = {}
            const filterChildren = []
            if (props.filterFloatPosition.includes('bottom'))
              Object.assign(btnStyle, {
                bottom: parseInt(cssVars.paginationHeight) + parseInt(cssVars.paginationMargin) * 2 + self.tableSizes.footerHeight + (self.tableSizes.tableWidth > self.tableSizes.width ? 10 : 0) + 25 + 'px',
              })
            else if (props.filterFloatPosition.includes('top'))
              Object.assign(btnStyle, {
                top: self.tableSizes.headerHeight + 25 + 'px',
              })

            if (self.$data.$filterSettings.opened) {
              const colWidth = calcWidth(self.$data.$filterSettings.colsCount)
              Object.assign(btnStyle, {
                width: self.$data.$filterSettings.colsCount * colWidth + '%',
              })
              Object.assign(ctxOpts.attrs, {
                'filter-data': self.$data.$filterData,
                'filter-settings': self.$data.$filterSettings,
                'cols-items': self.$data.$headers,
                'cols-count': self.$data.$filterSettings.colsCount,
                'col-width': colWidth,
                'filter-width': self.tableSizes.width * (self.$data.$filterSettings.colsCount * colWidth / 100) - 20,
              })
              filterChildren.push(_c(
                'BaseFilter',
                ctxOpts,
              ))
            } else {
              Object.assign(ctxOpts.attrs, {
                src: Icons['filter-outline'],
                alt: `Показать фильтр`,
              })
              filterChildren.push(_c(
                'img',
                ctxOpts,
              ))
            }

            arr.push(_c(
              'div',
              {
                staticClass: `float-window ${props.filterFloatPosition}`,
                style: btnStyle,
                class: {
                  button: !self.$data.$filterSettings.opened,
                  window: self.$data.$filterSettings.opened,
                },
                directives: [
                  {
                    name: 'click-outside',
                    value: () => {
                      if (self.$data.$filterSettings.opened)
                        self.$emit('update:filter-settings', {
                          ...self.$data.$filterSettings,
                          opened: !self.$data.$filterSettings.opened,
                        })
                    },
                  },
                ],
                on: {
                  click: () => {
                    if (!self.$data.$filterSettings.opened)
                      self.$emit('update:filter-settings', {
                        ...self.$data.$filterSettings,
                        opened: !self.$data.$filterSettings.opened,
                      })
                  },
                },
              },
              filterChildren
            ))
            return arr
          },
          null,
          props,
        ),
        self._t(
          `content.loader`,
          [
            self.$data.$loading.state ?? self.$data.$loading.text ?
            _c(
              `div`,
              {
                staticClass: 'loader--wrapper',
              },
              [
                _c(
                  `p`,
                  {
                    staticClass: 'loader--content',
                  },
                  self.loadingTextArr.map(letter => _c(
                    `span`,
                    {},
                    [self._v(self._s(letter))]
                  )),
                )
              ],
            ) : self._v(self._s(''))
          ],
          null,
          self.$data.$loading,
        ),
        self._t(
          `table.append`,
          [],
          null,
          props,
        ),
        self._t(
          `pagination`,
          function () {
            const arr = []
            if (self.$data.$pagination.length > 1)
              arr.push(_c(
                `Pagination`,
                self._g(
                  self._b(
                    {
                      model: {
                        value: self.$data.$pagination.value,
                        callback: (val) => self.$set(self.$data.$pagination, 'value', val),
                        expression: 'pagination.value',
                      },
                    },
                    'Pagination',
                    self.$data.$pagination,
                    false,
                    true
                  ),
                  $listeners
                )
              ))
            return arr
          },
          null,
          {
            pagination: self.$data.$pagination,
            items: props.items,
          },
        ),
        self._t(
          `content.append`,
          [],
          null,
          props,
        ),
      ],
      2
    )
  },
}