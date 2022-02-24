<template>
  <form @submit.prevent="searchOnPage" class="text-field">
    <label for="search">{{ label }}</label>
    <input
      @input="typingText"
      :value="value"
      :placeholder="label"
      ref="search"
      name="search"
      type="search"
      autofocus
    />

    <img
      @click="searchOnPage"
      :src="iconSearch"
      alt="Поиск"
    >
    <img
      v-if="value"
      @click="clearSearch"
      :src="iconClose"
      alt="Очистить поиск"
    >
  </form>
</template>

<script>
import Icons from '@/assets/icons'

export default {
  name: 'BaseSearchField',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: 'Поиск на странице',
    },
  },
  model: {
    prop: 'value',
    event: 'update:value',
  },
  computed: {
    iconSearch() {
      return Icons.magnify
    },
    iconClose() {
      return Icons.close
    },
  },
  methods: {
    focusOnField() {
      this.$refs?.search?.focus?.()
    },
    //    Emit событий родителю
    //  Search by str
    searchOnPage() {
      this.$emit('search-on-page')
    },
    //  Clear search
    clearSearch() {
      this.$emit('update:value', '')
      this.$nextTick(() => this.searchOnPage())
    },
    //  Событие обновления value
    typingText({target}) {
      this.$emit('update:value', target.value)
    },
  },
}
</script>