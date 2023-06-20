<template>
  <div style="margin-top: 16px">
    <el-form-item label="处理用户">
      <el-select
        v-model="userTaskForm.assignee"
        @change="updateElementTask('assignee')"
        filterable
        remote
        placeholder="输入姓名搜索"
        remote-show-suffix
        :remote-method="assigneeRemoteMethod"
        :loading="selectData.loading"
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.displayName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="候选用户">
      <el-select
        v-model="userTaskForm.candidateUsers"
        @change="updateElementTask('candidateUsers')"
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        remote
        placeholder="输入姓名搜索"
        remote-show-suffix
        :remote-method="assigneeRemoteMethod"
        :loading="selectData.loading"
      >
        <el-option
          v-for="item in userOptions"
          :key="item.id"
          :label="item.displayName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="候选分组">
      <el-select
        v-model="userTaskForm.candidateGroups"
        @change="updateElementTask('candidateGroups')"
        multiple
        collapse-tags
        collapse-tags-tooltip
        filterable
        remote
        placeholder="输入名称搜索"
        remote-show-suffix
        :remote-method="groupRemoteMethod"
        :loading="selectData.loading"
      >
        <el-option
          v-for="item in groupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input
        v-model="userTaskForm.dueDate"
        clearable
        @change="updateElementTask('dueDate')"
      />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input
        v-model="userTaskForm.followUpDate"
        clearable
        @change="updateElementTask('followUpDate')"
      />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input
        v-model="userTaskForm.priority"
        clearable
        @change="updateElementTask('priority')"
      />
    </el-form-item>
  </div>
</template>

<script>
import {groupList, userList} from "@/api/flowable";

export default {
  name: "UserTask",
  props: {
    id: String,
    type: String,
  },
  data() {
    return {
      selectData: {
        loading: false,
      },
      defaultTaskForm: {
        assignee: "",
        candidateUsers: [],
        candidateGroups: [],
        dueDate: "",
        followUpDate: "",
        priority: "",
      },
      userTaskForm: {},
      userOptions: [],
      groupOptions: [],
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
        let value;
        if (key === "candidateUsers" || key === "candidateGroups") {
          value = this.bpmnElement?.businessObject[key]
            ? this.bpmnElement.businessObject[key].split(",")
            : [];
        } else {
          value =
            this.bpmnElement?.businessObject[key] || this.defaultTaskForm[key];
        }
        this.userTaskForm[key] = value;
      }
    },
    updateElementTask(key) {
      const taskAttr = Object.create(null);
      if (key === "candidateUsers" || key === "candidateGroups") {
        taskAttr[key] =
          this.userTaskForm[key] && this.userTaskForm[key].length
            ? this.userTaskForm[key].join()
            : null;
      } else {
        taskAttr[key] = this.userTaskForm[key] || null;
      }
      window.bpmnInstances.modeling.updateProperties(
        this.bpmnElement,
        taskAttr
      );
    },
    assigneeRemoteMethod(query) {
      this.selectData.loading = true;
      userList(query).then((res) => {
        this.selectData.loading = false;
        this.userOptions = res.data;
      });
    },
    groupRemoteMethod(query) {
      this.selectData.loading = true;
      groupList(query).then((res) => {
        this.selectData.loading = false;
        this.groupOptions = res.data;
      });
    },
  },
  mounted() {
    userList(null).then((res) => {
      this.userOptions = res.data;
    });
    groupList(null).then((res) => {
      this.groupOptions = res.data;
    });
  },
  beforeUnmount() {
    this.bpmnElement = null;
  },
};
</script>
