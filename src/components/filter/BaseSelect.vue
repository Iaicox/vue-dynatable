<template>
<div v-click-outside="closeMultiSelect" class="select">
  <div
    @click="openMultiSelect"
    :class="{ disabled }"
    class="text-field"
  >
    <label for="select-value">{{ label }}</label>
    <div v-if="multi" class="chips">
      <div
        v-for="item, i in valueSelected"
        :key="i"
        class="chip"
      >
        {{ simpleArray ? item : item[itemName] }}
        <img @click="popOption(item, i)" :src="cancelBtn" alt="Удалить">
      </div>
    </div>

    <input
      v-if="!multi || !valueSelected.length"
      :class="`${inputClass}`"
      :disabled="disabled"
      :placeholder="getSelected"
      autocomplete="off"
      id="select-value"
      type="text"
      readonly
    />

    <img
      v-if="!valueSelected.length"
      @click.stop="toggleListVisibility"
      :src="iconExpand"
      :alt="isOpen ? 'Скрыть' : 'Раскрыть'"
    >
    <img
      v-else
      @click.stop="deselctAll"
      :src="cancelBtn"
      alt="Очистить"
    >
  </div>

  <div
    :class="{
      show: isOpen,
      [popoverClass]: popoverClass,
    }"
    :style="getPosition"
    class="dropdown-list"
  >
    <slot name="dropdown-list--pre" v-bind="{...$props}">
      <div class="dropdown-list--pre">
        <div v-if="search" class="search-input">
          <input
            @input="searchByStr"
            @keydown.enter.prevent="selectOption(preSelectedOption)"
            @keydown.down.prevent="preSelectNext"
            @keydown.up.prevent="preSelectPrev"
            v-model="searchInput"
            ref="search"
            placeholder="Поиск"
            type="text"
          />
          <button
            class="btn btn-clear"
            @click="clearSearch"
          >
            <img :src="cancelBtn" alt="Очистить">
          </button>
        </div>
      </div>
    </slot>

    <div v-if="groups">
      <ul class="tab-block">
        <li
          @click="selectTab(index)"
          v-for="tab, index in notEmptyTabs"
          :class="{active : idSelectedTab == index}"
          :key="index"
          class="tab-item"
        >
          <span>{{tab[groupName]}}</span>
        </li>
      </ul>
    </div>

    <div v-if="!valueSelected || isAllHidden" class="empty-tab">{{ emptyTabText }}</div>

    <ul v-else class="dropdown-list--content">
      <li
        @click="selectOption(option)"
        @mouseenter="preSelectOption(option)"
        v-for="option, index in getSelectedTabVisibleItems"
        :class="{
          disabled: option.disabled,
          selected: option.selected,
          hovered: preSelectedOption[itemId] === option[itemId],
        }"
        :key="index"
        class="dropdown-list--item"
      >
        <slot name="list-item" :option="option">
          <img
            :src="iconSelected(option)"
            class="icon"
            alt="Выбрать"
          >
          <span>{{option[itemName]}}</span>
        </slot>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import { compareArrayObject, compareSimpleArray } from '@/middleware/helpers'
import Icons from '@/assets/icons'

export default {
  name: 'BaseSelect',
  props: {
    value: {
      type: Array,
      default: () => ([]),
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    'item-list': {
      type: Array,
      default: () => [],
    },

    label: {
      type: String,
      default: 'Селект',
    },
    eventName: {
      type: String,
      default: 'update:value',
    },
    emptyTabText: {
      type: String,
      default: 'Нет данных',
    },
    position: {
      type: String,
      default: 'bottom',
    },
    'cancel-btn-icon': {
      type: String,
      default: 'close',
    },

    'input-class': {
      type: String,
      default: '',
    },
    'popover-class': {
      type: String,
      default: '',
    },
    search: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },

    disabledUnSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multi: false,
      groups: false,
      groupName: '',
      itemName: '',
      itemId: '',

      valueSelected: [],
      globalModel: [],
      idSelectedTab: 0,
      isOpen: false,
      simpleArray: false,
      searchInput: '',
      preSelectedOption: {},
    }
  },
  model: {
    prop: 'value',
    event: 'update:value',
  },
  watch: {
    itemList: {
      handler() {
        this.setConfig()
      },
      deep: true,
    },
    value: {
      handler(newVal, oldval) {
        if (oldval && newVal && this.valueSelected) {
          if (this.simpleArray && !compareSimpleArray(newVal, this.valueSelected))
            this.initValues()
          else if (!compareArrayObject(newVal, this.valueSelected, this.itemName))
            this.initValues()
        }
      },
      deep: true,
    },
  },
  computed: {
    getPosition() {
      const positions = this.position.split('-')
      const style = {}
      positions.forEach(pos => {
        switch (pos) {
          case 'left':
          case 'right':
            style[pos] = 0
            break
          case 'top':
            style.bottom = 0
            break
        }
      })
      return style
    },
    getSelected() {
      const str = this.isOpen ? 'Скрыть список' : 'Показать список'
      const value = this.valueSelected.length
        ? this.simpleArray ? this.valueSelected[0] : this.valueSelected[0][this.itemName]
        : str
      return this.multi ? str : value
    },
    notEmptyTabs() {
      return this.globalModel.filter(el => el.items.length)
    },
    getSelectedTab() {
      return this.notEmptyTabs.length
        ? this.notEmptyTabs[this.idSelectedTab]
        : {items: []}
    },
    getSelectedTabVisibleItems() {
      return this.getSelectedTab.items.filter(el => el.visible)
    },

    cancelBtn() {
      return Icons[this.cancelBtnIcon]
    },
    iconExpand() {
      return this.isOpen ? Icons['menu-up'] : Icons['menu-down']
    },

    isAllSelected() {
      return !this.getSelectedTab.items.some(item => item.visible && !item.disabled && !item.selected)
    },
    isAllHidden() {
      return !this.getSelectedTab.items.some(item => item.visible && !item.disabled)
    },
  },

  methods: {
    openMultiSelect() {
      this.manualClick = true
      this.isOpen = true
      this.$nextTick(() => {
        this.$refs.search.focus()
        this.preSelectOption(this.getSelectedTabVisibleItems[0])
      })
      this.openStatus(this.isOpen)
    },
    closeMultiSelect() {
      this.manualClick = true
      this.isOpen = false
      this.openStatus(this.isOpen)
    },
    setConfig() {
      this.multi = this.options?.multi ?? false
      this.groups = this.options?.groups ?? false
      this.itemName = this.options?.itemName ?? 'name'
      this.itemId = this.options?.itemId ?? this.itemName
      this.groupName = this.options?.groupName ?? 'group'
      this.init()
    },

    init() {
      const clone = this.cloneData(this.itemList)

      if (!this.groups) {
        if (
          typeof this.itemList[0] === 'string' ||
          typeof this.itemList[0] === 'number'
        ) {
          this.simpleArray = true
          this.globalModel = [{ items: this.prepareArray(clone) }]
        } else {
          this.globalModel = [{ items: clone }]
        }
      } else {
        if (
          typeof clone[0].items[0] === 'string' ||
          typeof clone[0].items[0] === 'number'
        ) {
          clone.forEach(item => item.items = this.prepareArray(item.items))
          this.simpleArray = true
        }
        this.globalModel = clone
      }
      this.initValues()
    },
    initValues() {
      this.valueSelected = []
      this.globalModel.forEach(tab => {
        tab.items.forEach(item => {
          item.selected ?? this.$set(item, 'selected', false)
          item.disabled ?? this.$set(item, 'disabled', false)
          item.visible ?? this.$set(item, 'visible', true)

          if (
            this.simpleArray &&
            (
              item.selected ||
              this.value.some(selected => item[this.itemId] === selected)
            )
          ) {
            item.selected = true
            this.valueSelected.push(item[this.itemId])
          } else if (
            !this.simpleArray &&
            (
              item.selected ||
              this.value.some(selected => item[this.itemId] === selected[this.itemId])
            )
          ) {
            item.selected = true
            const opt = { ...item }
            delete opt.selected
            delete opt.disabled
            delete opt.visible
            this.valueSelected.push(opt)
          }
        })
      })
    },

    toggleListVisibility() {
      this.isOpen = !this.isOpen
      this.openStatus(this.isOpen)
    },

    preSelectOption(option) {
      this.preSelectedOption = option
    },
    preSelectNext() {
      const index = this.getSelectedTabVisibleItems.findIndex(item => item[this.itemId] === this.preSelectedOption[this.itemId])
      if (~index && index + 1 < this.getSelectedTabVisibleItems.length)
        this.preSelectOption(this.getSelectedTabVisibleItems[index + 1])
    },
    preSelectPrev() {
      const index = this.getSelectedTabVisibleItems.findIndex(item => item[this.itemId] === this.preSelectedOption[this.itemId])
      if (~index && index)
        this.preSelectOption(this.getSelectedTabVisibleItems[index - 1])
    },

    selectOption(option) {
      if (option.disabled)
        return

      if (!option.selected) {
        if (!this.multi) {
          if (this.valueSelected.length)
            this.popOption(this.valueSelected[0], 0)
          this.closeMultiSelect()
        }
        this.pushOption(option)
      } else {
        if (!this.multi && this.disabledUnSelect)
          return

        this.popOption(option)
      }
    },
    pushOption(option) {
      if (this.simpleArray)
        this.valueSelected.push(option[this.itemId])

      else {
        const opt = { ...option }
        delete opt.selected
        delete opt.disabled
        delete opt.visible
        this.valueSelected.push(opt)
      }

      option.selected = true
      this.$emit(this.eventName, this.valueSelected.slice(0))
    },
    popOption(option, index) {
      let find = null
      if (typeof index === 'undefined') {
        index = this.valueSelected.findIndex(value =>
          (!this.simpleArray && value[this.itemId] === option[this.itemId]) ||
          (this.simpleArray && value === option[this.itemId])
        )
        find = option
      } else {
        this.globalModel.forEach(tab => tab.items.forEach(item => option[this.itemId] === item[this.itemId] ? find = item : void 0))
      }

      find && (find.selected = ~index ? false : true)
      const item = ~index ? this.valueSelected.splice(index, 1) : null
      this.$emit(this.eventName, this.valueSelected.slice(0))
      return item
    },
    selectTab(id) {
      this.idSelectedTab = id
      this.searchByStr()
    },
    searchByStr() {
      this.getSelectedTab.items.forEach(item => {
        if (~String(item[this.itemName]).toLowerCase().indexOf(this.searchInput.toLowerCase()))
          item.visible = true
        else
          item.visible = false
      })

      this.preSelectOption(this.getSelectedTabVisibleItems[0] ?? {})
    },
    clearSearch() {
      this.searchInput = ''
      this.searchByStr()
    },
    deselctAll() {
      this.globalModel.forEach(tab => {
        tab.items.forEach(item => !item.disabled && item.selected ? this.popOption(item) : void 0)
      })
    },

    prepareArray(value) {
      return value.map(elem => ({ [this.itemId]: elem }))
    },
    cloneData(value) {
      if (value)
        return JSON.parse(JSON.stringify(value))
      else
        return value
    },
    openStatus(status) {
      const event = status ? 'select-open' : 'select-close'
      this.$emit(event)
    },

    iconSelected(option) {
      return option.selected ? Icons.check : Icons.minus
    },
  },
  created() {
    this.setConfig()
  },
}
</script>