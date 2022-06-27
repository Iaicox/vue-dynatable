import Icons from '@/assets/icons'
//  Helpers
import { CollectClasses } from '@/middleware/helpers'

let clickedEl = null

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
      if (!props.draggable || !(clickedEl && clickedEl.closest('.drag-mark')))
        return e.preventDefault()

      e.target.classList.add('dragging')
      listeners['th-dragstart']({
        event: e,
        target: e.target,
        valueFrom: props.value || props.title,
        valueFromIsParent: !props.value && !!props.title
      })
    }
    function dragEnd(e) {
      e.target.classList.remove('dragging')
      listeners['th-dragend']({
        event: e,
        target: e.target,
        valueTo: props.value || props.title,
        valueToIsParent: !props.value && !!props.title
      })
    }
    function dragOver(e) {
      e.preventDefault()

      listeners?.['th-dragover']({
        event: e,
        target: e.target,
        valueTo: props.value || props.title,
        valueToIsParent: !props.value && !!props.title
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
    /**
     * @name onMouseDown
     * @param {MouseEvent} event
     * @description Check if handler clicked and resize started
     */
    function onMouseDown(event) {
      listeners['cell-resize'](event)

      clickedEl = event.target
      document.addEventListener('mouseup', () => {
        setTimeout(() => {
          clickedEl = null
        })
      }, {once: true})
    }

    return _c(
      'th',
      {
        staticClass: 'dt--cell',
        class: {
          col_order: props.value === 'col_order',
          col_actions: props.value === 'col_actions',
          parent: props.colspan > 1,
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
          dragover: dragOver,
          mousemove: checkCursor,
          mousedown: onMouseDown,
          click: e => listeners?.['header-click']?.({
            event: e,
            cell: props,
          }),
          contextmenu: e => listeners?.['header-context']?.({
            event: e,
            cell: props,
          }),
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

            if (props.draggable)
              children.push(_c(
                'div',
                {
                  staticClass: 'drag-mark draggable',
                },
                [
                  ctx._t(
                    `header.${props.value}.drag_mark`,
                    function () {
                      return [
                        _c('span', {
                          staticClass: 'db--icon',
                          style: `--db--icon: url(${Icons['drag-horizontal']})`,
                          attrs: {
                            alt: 'drag-horizontal',
                          },
                        }),
                      ]
                    },
                    null,
                    props
                  ),
                ]
                ,
                2
              ))

            if (props.resizable)
              children.push(_c(
                'div',
                {
                  staticClass: 'resize-mark',
                },
                [],
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