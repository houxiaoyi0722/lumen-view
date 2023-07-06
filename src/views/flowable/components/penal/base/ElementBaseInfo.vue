<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="elementBaseInfo.name"
          clearable
          @change="updateBaseInfo('name')"
        />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input
            v-model="elementBaseInfo.versionTag"
            clearable
            @change="updateBaseInfo('versionTag')"
          />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch
            v-model="elementBaseInfo.isExecutable"
            active-text="是"
            inactive-text="否"
            @change="updateBaseInfo('isExecutable')"
          />
        </el-form-item>
        <el-form-item label="流程启动者">
          <el-select
            v-model="elementBaseInfo.candidateStarterUsers"
            @change="updateBaseInfo('candidateStarterUsers')"
            clearable
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
        <el-form-item label="流程启动者组">
          <el-select
            v-model="elementBaseInfo.candidateStarterGroups"
            @change="updateBaseInfo('candidateStarterGroups')"
            filterable
            clearable
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
        <el-form-item label="流程处理页面">
          <el-input
            v-model="elementBaseInfo.processDisposePath"
            clearable
            @change="updateBaseInfo('processDisposePath')"
          />
        </el-form-item>
      </template>
      <el-form-item
        v-if="elementBaseInfo.$type === 'bpmn:SubProcess'"
        label="状态"
      >
        <el-switch
          v-model="elementBaseInfo.isExpanded"
          active-text="展开"
          inactive-text="折叠"
          @change="updateBaseInfo('isExpanded')"
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { groupList, userList } from "@/api/flowable";

export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      elementBaseInfo: {},
      selectData: {
        loading: false,
      },
      userOptions: [],
      groupOptions: [],
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      },
    },
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement || {};
      this.elementBaseInfo = JSON.parse(
        JSON.stringify(this.bpmnElement.businessObject)
      );
      if (
        this.elementBaseInfo &&
        this.elementBaseInfo.$type === "bpmn:SubProcess"
      ) {
        this.elementBaseInfo["isExpanded"] =
          this.elementBaseInfo.di?.isExpanded;
      }
    },
    updateBaseInfo(key) {
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` },
        });
        return;
      }
      if (key === "isExpanded") {
        window?.bpmnInstances?.modeling.toggleCollapse(this.bpmnElement);
        return;
      }
      const attrObj = Object.create(null);
      attrObj[key] = this.elementBaseInfo[key];
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
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
  beforeUnmount() {
    this.bpmnElement = null;
  },
};
</script>
