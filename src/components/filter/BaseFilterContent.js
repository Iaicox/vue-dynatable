//  Styles
import Icons from '@/assets/icons'
//  Helpers
import { toNumber, isObjEmpty } from '@/middleware/helpers'
//  Component generators
const filterItemElemsDict = {
  select(options) {
    return this.$createElement('BaseSelect', options)
  },
  range(options) {
    return this.$createElement('BaseRangeChooser', options)
  },
  date(options) {
    return this.$createElement('BaseDateChooser', options)
  },
  radio(options) {
    return this.$createElement('BaseRadioGroup', options)
  },
  checkbox(options) {
    return this.$createElement('BaseCheckboxGroup', options)
  },
  switch(options) {
    return this.$createElement('BaseSwitcher', options)
  },
  search(options) {
    return this.$createElement('BaseSearchField', options)
  },
}
// !!! Дописать range & date
const filterItemOptsDict = {
  select(options, key) {
    const self = this
    return {
      attrs: {
        options: {
          multi: options.multiple ?? false,
          groups: options.groups ?? false,
          itemName: options.itemName ?? 'name',
          itemId: options.itemId ?? options.itemName ?? 'name',
        },
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        value: options.selected,
        itemList: options.items,
        disabled: options.disabled ?? false,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          select: {
            ...self.filterData.select,
            [key]: {
              ...self.filterData.select[key],
              selected,
            },
          },
        })
      },
    }
  },
  range(options, key) {
    const self = this
    return {
      attrs: {
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        value: options.selected,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          range: {
            ...self.filterData.range,
            [key]: {
              ...self.filterData.range[key],
              selected,
            },
          },
        })
      },
    }
  },
  date(options, key) {
    const self = this
    return {
      attrs: {
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        value: options.selected,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          date: {
            ...self.filterData.date,
            [key]: {
              ...self.filterData.date[key],
              selected,
            },
          },
        })
      },
    }
  },
  radio(options, key) {
    const self = this
    return {
      attrs: {
        items: options.items,
        value: options.selected,
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        [options.allBtnShow && 'allBtnShow']: options.allBtnShow,
        [options.allBtnLabel && 'allBtnLabel']: options.allBtnLabel,
        [options.allBtnValue && 'allBtnValue']: options.allBtnValue,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          radio: {
            ...self.filterData.radio,
            [key]: {
              ...self.filterData.radio[key],
              selected,
            },
          },
        })
      },
    }
  },
  checkbox(options, key) {
    const self = this
    return {
      attrs: {
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        value: options.selected,
        items: options.items,
        [options.allBtnShow && 'allBtnShow']: options.allBtnShow,
        [options.allBtnLabel && 'allBtnLabel']: options.allBtnLabel,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          checkbox: {
            ...self.filterData.checkbox,
            [key]: {
              ...self.filterData.checkbox[key],
              selected,
            },
          },
        })
      },
    }
  },
  switch(options, key) {
    const self = this
    return {
      attrs: {
        label: options.name || options.title || self.colsItems.find(el => el.value === key)?.title,
        labels: options.items ?? options.labels ?? [],
        disabled: options.disabled ?? false,
        value: options.selected,
      },
      on: {
        'update:value': selected => self.$emit('update:filter-data', {
          ...self.filterData,
          switch: {
            ...self.filterData.switch,
            [key]: {
              ...self.filterData.switch[key],
              selected,
            },
          },
        })
      },
    }
  },
  search(options) {
    const self = this
    return {
      attrs: {
        byItems: options.byItems,
        value: options.searchField,
      },
      ref: 'searchField',
      on: {
        'update:value': searchField => self.$emit('update:filter-data', {
          ...self.filterData,
          search: {
            ...self.filterData.search,
            searchField,
          },
        }),
        'search-on-page': () => {
          self.$emit('update:filter-data', self.filterData)
          self.$emit('filter-items')
        },
      },
    }
  },
}

export default {
  name: 'BaseFilterContent',
  components: {
    BaseColsSettings: () => import('@/components/filter/BaseColsSettings'),
    BaseSearchField: () => import('@/components/filter/BaseSearchField'),
    BaseSelect: () => import('@/components/filter/BaseSelect'),
    BaseSwitcher: () => import('@/components/filter/BaseSwitcher'),
    BaseRadioGroup: () => import('@/components/filter/BaseRadioGroup'),
    BaseCheckboxGroup: () => import('@/components/filter/BaseCheckboxGroup'),
    // BaseDatePicker: () => import('@/components/filter/BaseDatePicker'),
    // BaseRangePicker: () => import('@/components/filter/BaseRangePicker'),
  },
  props: {
    'filter-data': {
      type: Object,
      default: () => ({}),
    },
    'filter-settings': {
      type: Object,
      default: () => ({}),
    },
    'cols-items': {
      type: Array,
      default: () => [],
    },
    'cols-count': {
      type: Number,
      default: 1,
    },
    'col-width': {
      type: Number,
      default: 100,
    },
    'filter-width': {
      type: Number,
      default: 100,
    },
  },
  computed: {
    selectedFilters() {
      let count = 0
      Object.entries(this.filterData).forEach(([key, value]) => {
        Object.values(value).forEach(el => {
          switch (key) {
            case 'select':
            case 'checkbox':
              if (el.selected.length)
                count++
              break
            case 'switcher':
              count++
              break
            case 'range':
              if (el.min < el.selected[0] || el.max > el.selected[1])
                count++
              break
            case 'date':
              if (el.selected.some(el => !!el))
                count++
              break
            case 'radio':
              if ((el['all-btn-value'] && el['all-btn-value'] !== el.value) || el.value)
                count++
              break
          }
        })

        if (value.searchField)
          count++
      })
      return count
    },
  },
  methods: {
    clearData() {
      const data = JSON.parse(JSON.stringify(this.filterData))

      Object.entries(data).forEach(([type, value]) => {
        if (type === 'search')
          value.searchField = ''
        else
          Object.values(value).forEach(options => {
            switch (type) {
              case 'select':
                options.selected = []
                break
            }
          })
      })

      return data
    },
  },

  render() {
    {
      const self = this
      const _h = self.$createElement
      const _c = self._c || _h
      const { _props: props, $listeners } = self

      const positions = this.filterSettings?.position ?? Object.values(this.filterData).reduce((arr, el) => {
        const item = arr[0] ?? {
          order: [],
          width: 'auto',
        }
        !arr[0] && arr.push(item)
        if (el.hasOwnProperty('searchField'))
          item.order.push('search')
        else
          item.order.push(...Object.keys(el))
        return arr
      }, [])

      let filterWidth = props.filterWidth
      let countAuto = +props.filterSettings?.colsSettings
      const cols = positions.map(col => {
        let style = { width: col.width }
        if (col.width?.includes('px'))
          filterWidth -= parseInt(col.width)
        if (!col.width || col.width === 'auto') {
          countAuto++
          style = {get width() {
            return filterWidth / (countAuto || 1) + 'px'
          }}
        }
        if (col.width?.includes('%') || !isNaN(col.width))
          style.width = props.filterWidth * col.width / 100 + 'px'

        return _c(
          'div',
          {
            staticClass: 'filter--col',
            style,
          },
          col.order.map(key => {
            let elType = ''
            let options = {}
            if (key === 'search') {
              elType = key
              options = this.filterData[elType]
            } else {
              elType = Object.keys(this.filterData).find(col => Object.keys(this.filterData[col]).some(value => value === key))
              options = this.filterData[elType][key]
            }

            return filterItemElemsDict[elType].call(this, filterItemOptsDict[elType].call(this, options, key))
          })
        )
      })

      return _c(
        'div',
        { staticClass: 'filter--wrapper' },
        [
          props.filterSettings?.colsSettings
            ? _c(
              'BaseColsSettings',
              {
                attrs: {
                  items: props.colsItems,
                  [!!props.filterSettings?.saveId && 'id']: props.filterSettings.saveId,
                },
                on: {
                  ...$listeners,
                  'update:items': items => {
                    const headerObj = Object.fromEntries(self.colsItems.map(item => [item.value, item]))
                    const newHeaderObj = Object.fromEntries(items.map(item => [item.value, item]))
                    const newItems = [...Object.values({
                      ...headerObj,
                      ...newHeaderObj,
                    })]
                    self.$emit('update:cols-items', newItems)
                  },
                },
              },
            )
            : self._v(self._s(''))
          ,
          _c(
            'div',
            {
              staticClass: 'filter--content',
              style: {
                flexGrow: (props.colsCount - +props.filterSettings?.colsSettings) || 1
              },
            },
            [
              _c(
                'h4',
                {},
                [
                  self._v(self._s(`Фильтр (${self.selectedFilters})`)),
                ]
              ),
              _c(
                'div',
                { staticClass: 'filter--cols' },
                cols,
              ),
              _c(
                'div',
                { staticClass: 'filter--btns' },
                [
                  _c(
                    'button',
                    {
                      staticClass: 'clear',
                      on: {
                        click: () => {
                          self.$emit('update:filter-data', self.clearData())
                          self.$emit('filter-items')
                        },
                      },
                    },
                    [
                      _c(
                        'img',
                        {
                          attrs: {
                            src: Icons['filter-off-outline'],
                            alt: 'Очистить фильтр',
                          },
                        }
                      ),
                      self._v(self._s('Очистить'))
                    ],
                  ),
                  _c(
                    'button',
                    {
                      staticClass: 'apply',
                      on: {
                        click: () => self.$emit('filter-items'),
                      },
                    },
                    [
                      _c(
                        'img',
                        {
                          attrs: {
                            src: Icons['filter-check-outline'],
                            alt: 'Применить фильтрацию',
                          },
                        }
                      ),
                      self._v(self._s('Применить'))
                    ],
                  ),
                ],
              ),
            ]
          ),
        ],
      )
    }
  },
}