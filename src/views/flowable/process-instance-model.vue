<template>
  <div id="bpmnModel" />
</template>

<script>
import "./components/display/jquery.qtip.min.css";
import "./components/display/displaymodel.css";
import "@/views/flowable/components/display/lib/jquery_1.11.0/jquery";
import "@/views/flowable/components/display/jquery.qtip.min";
import "@/views/flowable/components/display/raphael.min";
import "@/views/flowable/components/display/Polyline.js";
import "@/views/flowable/components/display/bpmn-draw";
import "@/views/flowable/components/display/bpmn-icons";
import "@/views/flowable/components/display/displaymodel.js";
import { historyModelJson, modelJson } from "@/api/flowable";
import {
  _drawStartEvent,
  _drawEndEvent,
  _drawUserTask,
  _drawExclusiveGateway,
  _drawLane,
  _drawSubProcess,
  _drawTransaction,
  _drawEventSubProcess,
  _drawAdhocSubProcess,
  _drawEvent,
  _drawServiceTask,
  _drawSendEventServiceTask,
  _drawExternalWorkerServiceTask,
  _drawHttpServiceTask,
  _drawCallActivity,
  _drawScriptTask,
  _drawBusinessRuleTask,
  _drawManualTask,
  _drawSendTask,
  _drawReceiveTask,
  _drawTask,
  _drawParallelGateway,
  _drawInclusiveGateway,
  _drawEventGateway,
  _drawGateway,
  _drawBoundaryEvent,
  _drawIntermediateCatchEvent,
  _drawThrowEvent,
  _drawMultilineText,
  _drawTextAnnotation,
  _drawArrowHead,
  _drawFlow,
  _drawAssociation,
  _drawPool,
} from "@/views/flowable/components/display/bpmn-draw";
import { defineComponent } from "vue"; //动态调用切勿删除

export default defineComponent({
  name: "ProcessInstanceModel",
  emits: ["close-modal-loading"],
  props: {
    processInstanceId: {
      type: String,
    },
    history: {
      type: Boolean,
    },
  },
  mounted() {
    {
      let INITIAL_CANVAS_WIDTH;
      let INITIAL_CANVAS_HEIGHT;

      let paper;
      let viewBox;
      let viewBoxWidth;
      let viewBoxHeight;

      let canvasWidth;
      let canvasHeight;

      (this.history
        ? historyModelJson(this.processInstanceId)
        : modelJson(this.processInstanceId)
      )
        .then((data) => {
          let i;
          if (
            (!data.elements || data.elements.length === 0) &&
            (!data.pools || data.pools.length === 0)
          )
            return;

          INITIAL_CANVAS_WIDTH = data.diagramWidth;
          INITIAL_CANVAS_WIDTH += 30;

          INITIAL_CANVAS_HEIGHT = data.diagramHeight + 50;
          canvasWidth = INITIAL_CANVAS_WIDTH;
          canvasHeight = INITIAL_CANVAS_HEIGHT;
          viewBoxWidth = INITIAL_CANVAS_WIDTH;
          viewBoxHeight = INITIAL_CANVAS_HEIGHT;

          // eslint-disable-next-line no-undef
          jQuery("#bpmnModel").width(INITIAL_CANVAS_WIDTH);
          // eslint-disable-next-line no-undef
          jQuery("#bpmnModel").height(INITIAL_CANVAS_HEIGHT);
          // eslint-disable-next-line no-undef
          paper = Raphael(
            document.getElementById("bpmnModel"),
            canvasWidth,
            canvasHeight
          );
          paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight, false);
          paper.renderfix();

          if (data.pools) {
            for (i = 0; i < data.pools.length; i++) {
              const pool = data.pools[i];
              _drawPool(pool);
            }
          }

          const modelElements = data.elements;
          for (i = 0; i < modelElements.length; i++) {
            const element = modelElements[i];
            try {
              switch (element.type) {
                case "StartEvent":
                  _drawStartEvent(element, paper);
                  break;
                case "EndEvent":
                  _drawEndEvent(element, paper);
                  break;
                case "UserTask":
                  _drawUserTask(element, paper);
                  break;
                case "ExclusiveGateway":
                  _drawExclusiveGateway(element, paper);
                  break;
                case "Lane":
                  _drawLane(element, paper);
                  break;
                case "SubProcess":
                  _drawSubProcess(element, paper);
                  break;
                case "Transaction":
                  _drawTransaction(element, paper);
                  break;
                case "EventSubProcess":
                  _drawEventSubProcess(element, paper);
                  break;
                case "AdhocSubProcess":
                  _drawAdhocSubProcess(element, paper);
                  break;
                case "Event":
                  _drawEvent(element, paper);
                  break;
                case "ServiceTask":
                  _drawServiceTask(element, paper);
                  break;
                case "SendEventServiceTask":
                  _drawSendEventServiceTask(element, paper);
                  break;
                case "ExternalWorkerServiceTask":
                  _drawExternalWorkerServiceTask(element, paper);
                  break;
                case "HttpServiceTask":
                  _drawHttpServiceTask(element, paper);
                  break;
                case "CallActivity":
                  _drawCallActivity(element, paper);
                  break;
                case "ScriptTask":
                  _drawScriptTask(element, paper);
                  break;
                case "BusinessRuleTask":
                  _drawBusinessRuleTask(element, paper);
                  break;
                case "ManualTask":
                  _drawManualTask(element, paper);
                  break;
                case "SendTask":
                  _drawSendTask(element, paper);
                  break;
                case "ReceiveTask":
                  _drawReceiveTask(element, paper);
                  break;
                case "Task":
                  _drawTask(element, paper);
                  break;
                case "ParallelGateway":
                  _drawParallelGateway(element, paper);
                  break;
                case "InclusiveGateway":
                  _drawInclusiveGateway(element, paper);
                  break;
                case "EventGateway":
                  _drawEventGateway(element, paper);
                  break;
                case "Gateway":
                  _drawGateway(element, paper);
                  break;
                case "BoundaryEvent":
                  _drawBoundaryEvent(element, paper);
                  break;
                case "IntermediateCatchEvent":
                  _drawIntermediateCatchEvent(element, paper);
                  break;
                case "ThrowEvent":
                  _drawThrowEvent(element, paper);
                  break;
                case "MultilineText":
                  _drawMultilineText(element, paper);
                  break;
                case "TextAnnotation":
                  _drawTextAnnotation(element, paper);
                  break;
                case "ArrowHead":
                  _drawArrowHead(element, paper);
                  break;
              }
            } catch (err) {
              console.log(err);
            }
          }

          if (data.flows) {
            for (i = 0; i < data.flows.length; i++) {
              const flow = data.flows[i];
              if (flow.type === "sequenceFlow") {
                _drawFlow(flow, paper);
              } else if (flow.type === "association") {
                _drawAssociation(flow, paper);
              }
            }
          }
          this.$emit("close-modal-loading");
        })
        .catch(() => {
          this.$emit("close-modal-loading");
        });
    }
  },
});
</script>

<style scoped></style>
