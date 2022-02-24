<template>
  <div class="switcher">
    <div class="header">{{ label }}</div>

    <label>
      {{ labels[0] }}
      <input
        @click="swichValue"
        :checked="$data.$value"
        :disabled="disabled"
        type="checkbox"
      >
      <span class="lever"></span>
      {{ labels[1] }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'BaseSwitcher',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Switcher',
    },
    labels: {
      type: Array,
      default: () => ['0', '1'],
      validator: arr => arr.length === 2 && arr.every(el => ['string', 'number'].includes(typeof el)),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      $value: false,
    }
  },
  model: {
    prop: 'value',
    event: 'update:value',
  },
  watch: {
    value: {
      handler() {
        this.$data.$value = this.value
      },
      immediate: true,
    },
  },
  methods: {
    swichValue() {
      const newValue = !this.$data.$value
      this.$emit('update:value', newValue)
      this.$emit('switch', {
        value: newValue,
        label: this.labels[+newValue],
      })
    },
  },
}
</script>