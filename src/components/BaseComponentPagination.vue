<template>
  <ul class="pagination">
    <li :class="{disabled: value == 1}">
      <a
        @click="clickPage('prev', value - 1)"
        tabindex="-1"
      >{{ prevLabel }}</a>
    </li>

    <li
      v-for="page, i in calculateVisiblePages"
      :class="{
        active: page == value,
        space: page == '...',
      }"
      :key="page == '...' ? `space_${i}` : page"
    >
      <a
        @click="clickPage('change', page)"
        tabindex="0"
      >{{ page }}</a>
    </li>

    <li :class="{disabled: value == length}">
      <a
        @click="clickPage('next', value + 1)"
        tabindex="0"
      >{{ nextLabel }}</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BaseComponentPagination',
  props: {
    length: {
      type: Number | String,
      default: 0,
    },
    value: {
      type: Number | String,
      default: 1,
    },
    size: {
      type: Number | String,
      default: 50,
    },
    visible: {
      type: Number | String,
      default: 7,
    },

    'prev-label': {
      type: String,
      default: 'Назад',
    },
    'next-label': {
      type: String,
      default: 'Вперед',
    },
  },
  model: {
    prop: 'value',
    event: 'update:page',
  },
  computed: {
    calculateVisiblePages() {
      const arr = []
      for (let i = 1; i <= this.length; i++) {
        if (i === 1 || i === this.length)
          arr.push(i)
        else if ([this.value - 1, this.value, this.value + 1].includes(i))
          arr.push(i)
        else if ((this.value - 1 > 2 && i === 2) || (this.value + 1 < this.length - 1 && i === this.length - 1))
          arr.push('...')
      }
      return arr
    },
  },
  methods: {
    clickPage(action = 'change', page) {
      if (page === '...' || page === this.value)
        return

      this.$emit(action, { page })
      this.$emit('update:page', page)
    },
  },
}
</script>