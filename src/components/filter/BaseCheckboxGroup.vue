<template>
  <div class="checkbox-group">
    <div class="header">{{ label }}</div>

    <label
      v-if="allBtnShow"
      @click.prevent="chooseOption('all')"
    >
      <input
        :checked="allChecked"
        :indeterminate.prop="!allChecked && !allNotChecked"
        type="checkbox"
      />
      <span>{{ allBtnLabel }}</span>
    </label>

    <label
      @click="chooseOption"
      v-for="item in items"
      :key="item.value"
    >
      <input
        v-model="$data.$value"
        :value="item"
        type="checkbox"
      />
      <span>{{ item.label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'BaseCheckboxGroup',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: 'Checkbox group',
    },

    'all-btn-show': {
      type: Boolean,
      default: true,
    },
    'all-btn-label': {
      type: String,
      default: 'Все',
    },
  },
  model: {
    prop: 'value',
    event: 'update:value',
  },
  data() {
    return {
      $value: [],
    }
  },
  watch: {
    value: {
      handler() {
        this.$data.$value = this.value
      },
      immediate: true,
    },
  },
  computed: {
    allChecked() {
      return this.items.every(item => this.$data.$value.some(el => el.value === item.value))
    },
    allNotChecked() {
      return this.items.every(item => this.$data.$value.every(el => el.value !== item.value))
    },
  },
  methods: {
    chooseOption(all) {
      if (all === 'all') {
        const allChecked = this.allChecked
        this.$data.$value = []
        if (!allChecked)
          this.$data.$value = [...this.items]
      }

      setTimeout(() => {
        this.$emit('update:value', this.$data.$value)
      })
    },
  },
}
</script>