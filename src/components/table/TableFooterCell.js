import Icons from '@/assets/icons'
import Filters from '@/middleware/filters'
//  Helpers
import { CollectClasses } from '@/middleware/helpers'

export default {
  functional: true,
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    filter: {
      type: Object | null,
      default: null,
    },
    summary: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
    tooltipPosition: {
      type: String,
      default: 'top',
    },
    width: {
      type: String,
      default: 'auto',
    },
    position: {
      type: Number | null,
      default: null,
    },
    classHeader: {
      type: String | Array | Object | Function,
      default: '',
    },
    classCell: {
      type: String | Array | Object | Function,
      default: '',
    },
    'single-line': {
      type: Boolean,
      default: false,
    },
    alignHeader: {
      type: String,
      default: 'center',
    },
    alignCell: {
      type: String,
      default: 'left',
    },
    isIcon: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    groupable: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    singleLine: {
      type: Boolean,
      default: false,
    },

    clickOnHover: {
      type: Boolean,
      default: false,
    },
    clickOnHoverIcon: {
      type: String,
      default: 'eye',
    },
    clickOnHoverEvent: {
      type: String,
      default: 'open-modal',
    },

    prependBtn: {
      type: Boolean,
      default: false,
    },
    prependBtnHoverable: {
      type: Boolean,
      default: false,
    },
    prependBtnIcon: {
      type: String,
      default: 'window-maximize',
    },
    prependBtnEvent: {
      type: String,
      default: 'open-modal',
    },
    appendBtn: {
      type: Boolean,
      default: false,
    },
    appendBtnHoverable: {
      type: Boolean,
      default: false,
    },
    appendBtnIcon: {
      type: String,
      default: 'open-in-new',
    },
    appendBtnEvent: {
      type: String,
      default: 'open-in-new',
    },
  },
  render(_h, ctx) {
    const { _c, props, scopedSlots, listeners } = ctx
    ctx.$scopedSlots = scopedSlots

    return _c(
      'th',
      {
        staticClass: 'dt--cell',
        class: {
          single_line: props.singleLine,
          ...CollectClasses(props.classCell, props),
        },
        directives: [
          {
            name: 'tooltip',
            value: props.tooltip,
            modifiers: {
              [props.tooltipPosition]: true,
            },
          },
        ],
        on: {
          contextmenu: e => listeners?.['header-context']({
            event: e,
            cell: props,
          })
        },
        key: props.value,
      },
      [
        ctx._t(
          `footer.${props.value}.default`,
          function () {
            const cellContent = []

            if (props.clickOnHover)
              cellContent.push(_c('a', {
                staticClass: 'cell--hover_btn',
                on: {
                  click: () => listeners?.[props.clickOnHoverEvent]?.(props)
                },
              }, [
                _c('img', {
                  attrs: {
                    src: Icons?.[props.clickOnHoverIcon],
                    alt: props.clickOnHoverIcon,
                  },
                }),
              ]))

            const children = []
            if (props.prependBtn)
              children.push(_c(
                'div',
                {
                  class: {
                    hoverable_unit: props.prependBtnHoverable,
                  },
                  staticClass: 'dt--cell__prepend',
                },
                props.prependBtn
                  ? [
                    ctx._t(
                      `footer.${props.value}.prepend`,
                      function () {
                        return [
                          _c('img', {
                            attrs: {
                              src: Icons?.[props.prependBtnIcon],
                              alt: props.prependBtnIcon,
                            },
                            on: {
                              click: () => listeners?.[props.prependBtnEvent]?.(props)
                            },
                          }),
                        ]
                      },
                      null,
                      props
                    ),
                  ]
                  : []
                ,
                2
              ))

            children.push(_c(
              'div',
              {
                class: {
                  [`align-${props.alignCell}`]: true,
                },
                staticClass: 'dt--cell__content',
              },
              [
                ctx._t(
                  `footer.${props.value}.content`,
                  function () {
                    if (props.isIcon)
                      return [
                        _c('img', {
                          attrs: {
                            src: Icons?.[props.icon],
                            alt: `${props.title}: ${props.item[props.value]}`,
                          },
                        }),
                      ]
                    else {
                      let value = props.summary[props.value]

                      if (props.filter && value)
                        value = Filters?.[props.filter.name]?.(value, ...(props.filter?.args ?? []))
                      if (props.customFilter && props.summary[props.value])
                        value = props.customFilter(props.summary[props.value])

                      return [
                        _c('div', {
                            staticClass: 'dt--cell__text',
                          }, [
                          ctx._v(ctx._s(value)),
                        ]),
                      ]
                    }
                  },
                  null,
                  props
                ),
              ],
              2
            ))

            if (props.appendBtn)
              children.push(_c(
                'div',
                {
                  class: {
                    hoverable_unit: props.appendBtnHoverable,
                  },
                  staticClass: 'dt--cell__append',
                },
                props.appendBtn
                  ? [
                    ctx._t(
                      `footer.${props.value}.append`,
                      function () {
                        return [
                          _c('img', {
                            attrs: {
                              src: Icons?.[props.appendBtnIcon],
                              alt: props.appendBtnIcon,
                            },
                            on: {
                              click: () => listeners?.[props.appendBtnEvent]?.(props)
                            },
                          }),
                        ]
                      },
                      null,
                      props
                    ),
                  ]
                  : []
                ,
                2
              ))

            cellContent.unshift(_c('div', { staticClass: 'dt--cell__wrapper' }, children))
            return cellContent
          },
          null,
          props,
        ),
      ],
    )
  },
}