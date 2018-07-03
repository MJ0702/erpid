<template>
  <div @change="$emit('change', currentValue)" class="mint-checklist" style="background:#fff" :class="{ 'is-limit': max <= currentValue.length }">
    <label class="mint-checklist-title" v-text="title"></label>
    <mt-cell v-for="option in options">
      <label class="mint-checklist-label" style="display: flex;
    align-items: center;" slot="title">
        <span
          :class="{'is-right': align === 'right'}"
          class="mint-checkbox">
          <input
            class="mint-checkbox-input"
            type="checkbox"
            v-model="currentValue"
            :disabled="option.disabled"
            :value="option.value || option">
          <span class="mint-checkbox-core"></span>
        </span>
        <span class="mint-checkbox-label" style="display:inline-block;padding:6px;">
                <span style="line-height:1.8;">{{accInfoFmt(option.label,0)}}</span><br>
                <span style="font-size:14px;color:#888;">{{accInfoFmt(option.label,1)}}</span>
        </span>
      </label>
    </mt-cell>
  </div>
</template>

<script>

/**
 * mt-checklist
 * @module components/checklist
 * @desc 复选框列表，依赖 cell 组件
 *
 * @param {(string[]|object[])} options - 选项数组，可以传入 [{label: 'label', value: 'value', disabled: true}] 或者 ['ab', 'cd', 'ef']
 * @param {string[]} value - 选中值的数组
 * @param {string} title - 标题
 * @param {number} [max] - 最多可选的个数
 * @param {string} [align=left] - checkbox 对齐位置，`left`, `right`
 *
 *
 * @example
 * <mt-checklist :v-model="value" :options="['a', 'b', 'c']"></mt-checklist>
 */
export default {
  name: 'my-checklist',
  props: {
    max: Number,
    title: String,
    align: String,
    options: {
      type: Array,
      required: true
    },
    value: Array
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  computed: {
    limit() {
      return this.max < this.currentValue.length;
    }
  },
  methods:{
    accInfoFmt(val, type) {
      if(val) {
        if(type==0) {
          return val.slice(0, val.indexOf("("));
        } else if (type==1) {
          return val.slice(val.indexOf("(")+1, val.lastIndexOf(")"));
        }
      }
      return val;
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      if (this.limit) val.pop();
      this.$emit('input', val);
    }
  }
};
</script>