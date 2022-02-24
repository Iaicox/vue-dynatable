<template>
  <div class="radio-group">
    <div class="header">{{ label }}</div>

    <label
      v-if="allBtnShow"
      @click="chooseOption(allBtnValue)"
    >
      <input
        :checked="$data.$value === allBtnValue"
        :value="allBtnValue"
        name="group"
        type="radio"
      />
      <span>{{ allBtnLabel }}</span>
    </label>

    <label
      @click="chooseOption(item.value)"
      v-for="item in items"
      :key="item.value"
    >
      <input
        :checked="$data.$value === item.value"
        :value="item.value"
        name="group"
        type="radio"
      />
      <span>{{ item.label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'BaseRadioGroup',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'Radio group',
    },
    'all-btn-show': {
      type: Boolean,
      default: true,
    },
    'all-btn-label': {
      type: String,
      default: 'Все',
    },
    'all-btn-value': {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      $value: '',
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
  model: {
    prop: 'value',
    event: 'update:value',
  },
  methods: {
    chooseOption(value) {
      this.$data.$value = value
      this.$emit('update:value', value)
    },
  },
}
</script>