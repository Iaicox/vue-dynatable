import Icons from '@/assets/icons'
//  Helpers
import { CollectClasses } from '@/middleware/helpers'

export default {
  name: 'TableHeaderCell',
  functional: true,
  props: {
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
    draggable: {
      type: Boolean,
      default: false,
    },

    colspan: {
      type: Number,
      default: 1,
    },
    rowspan: {
      type: Number,
      default: 1,
    },

    prependBtn: {
      type: Boolean,
      default: false,
    },
    prependBtnIcon: {
      type: String,
      default: 'pin',
    },
    prependBtnEvent: {
      type: String,
      default: 'pin-coll',
    },
    appendBtn: {
      type: Boolean,
      default: true,
    },
    appendBtnIcon: {
      type: String,
      default: 'sort',
    },
    appendBtnEvent: {
      type: String,
      default: 'sort-items',
    },

    'sort-direction': {
      type: String,
      default: '', // descending | ascending
    },
  },
  render(_h, ctx) {
    const { _c, props, scopedSlots, listeners } = ctx
    ctx.$scopedSlots = scopedSlots

    const SortIconAge = props.appendBtnEvent === 'sort-items'
      ? 'append'
      : props.prependBtnEvent === 'sort-items'
        ? 'prepend'
        : ''

    function dragStart(e) {
      if (!props.draggable)
        e.preventDefault()

      const parent = !props.value && !!props.title
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('valueFrom', props.value || props.title)
      e.dataTransfer.setData('valueFromIsParent', parent)
    }
    function dragEnd(e) {
      e.dataTransfer.clearData()
    }
    function drop(e) {
      const parent = !props.value && !!props.title
      listeners['drop-to-header']({
        event: e,
        valueTo: props.value || props.title,
        valueToIsParent: parent,
      })
    }
    function checkCursor(event) {
      const parent = !props.value && !!props.title
      let {currentTarget: target} = event
      listeners['check-resize']({
        event,
        target,
        value: props.value || props.title,
        isParent: parent,
      })
    }
    function resizeStart(event) {
      listeners['cell-resize'](event)
    }

    return _c(
      'th',
      {
        staticClass: 'dt--cell',
        class: {
          col_order: props.value === 'col_order',
          col_actions: props.value === 'col_actions',
          parent: props.colspan > 1,
          draggable: props.draggable,
          ...CollectClasses(props.classHeader, props),
        },
        attrs: {
          width: props.width,
          colspan: props.colspan,
          rowspan: props.rowspan,
          draggable: props.draggable,
        },
        on: {
          dragstart: dragStart,
          dragend: dragEnd,
          drop,
          mousemove: checkCursor,
          mousedown: resizeStart,
          contextmenu: e => listeners?.['header-context']({
            event: e,
            cell: props,
          })
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
        key: `${props.value ? '' : props.title}_${props.value}_${props.width}`,
      },
      [
        ctx._t(
          `header.${props.value}.default`,
          function () {
            const children = []
            if (props.prependBtn)
              children.push(_c(
                'div',
                {
                  class: {
                    hoverable_unit: props.prependBtn,
                  },
                  staticClass: 'dt--cell__prepend',
                },
                (SortIconAge == 'prepend' ? props.sortable : props.prependBtn)
                  ? [
                    ctx._t(
                      `header.${props.value}.prepend`,
                      function () {
                        return [
                          _c('img', {
                            attrs: {
                              src: Icons?.[props.prependBtnIcon] || Icons.pin,
                              alt: props.prependBtnIcon || `pin-${props.value}`,
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

            if (props.isIcon)
              children.push(_c(
                'div',
                {
                  class: {
                    [`align-${props.alignHeader}`]: true,
                  },
                  staticClass: 'dt--cell__content',
                },
                [
                  ctx._t(
                    `header.${props.value}.content`,
                    function () {
                      return [
                        _c('img', {
                          attrs: {
                            src: Icons?.[props.icon] || Icons.filter,
                            alt: props.title || props.tooltip || props.value,
                          },
                        }),
                      ]
                    },
                    null,
                    props
                  ),
                ],
                2
              ))
            else
              children.push(_c(
                'div',
                {
                  class: {
                    [`align-${props.alignHeader}`]: true,
                  },
                  staticClass: 'dt--cell__content',
                },
                [
                  ctx._t(
                    `header.${props.value}.content`,
                    function () {
                      return [
                        _c('div', {
                            staticClass: 'dt--cell__text',
                          }, [
                          ctx._v(ctx._s(props.title)),
                        ]),
                      ]
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
                    hoverable_unit: props.appendBtn,
                    showed: !!props.sortDirection,
                  },
                  staticClass: 'dt--cell__append',
                },
                (SortIconAge == 'append' ? props.sortable : props.appendBtn)
                  ? [
                    ctx._t(
                      `header.${props.value}.append`,
                      function () {
                        const icon = `sort${props.sortDirection ? '-' + props.sortDirection : ''}`
                        return [
                          _c('img', {
                            attrs: {
                              // src: Icons?.[props.appendBtnIcon] || Icons.filter,
                              src: Icons?.[icon] || Icons.filter,
                              alt: props.appendBtnIcon || `filter-${props.value}`,
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
            return [
              _c('div', { staticClass: 'dt--cell__wrapper' }, children),
            ]
          },
          null,
          props,
        ),
      ],
    )
  },
}