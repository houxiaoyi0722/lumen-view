<template>
  <div style="margin-top: 16px">
    <el-form-item label="类">
      <el-input
        v-model="scriptTaskForm.class"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: "ServiceTask",
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      defaultTaskForm: {
        class: "",
      },
      scriptTaskForm: {},
    };
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.bpmnElement = window.bpmnInstances.bpmnElement;
        this.$nextTick(() => this.resetTaskForm());
      },
    },
  },
  methods: {
    resetTaskForm() {
      for (const key in this.defaultTaskForm) {
        const value =
          this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        this.scriptTaskForm[key] = value;
      }
    },
    updateElementTask() {
      const taskAttr = Object.create(null);
      taskAttr.class = this.scriptTaskForm.class || null;
      window.bpmnInstances.modeling.updateProperties(
        this.bpmnElement,
        taskAttr
      );
    },
  },
  beforeUnmount() {
    this.bpmnElement = null;
  },
};
</script>
