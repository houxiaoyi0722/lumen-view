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
import {historyModelJson, modelJson} from "@/api/flowable";
import {
  _drawStartEvent,
  _drawUserTask,
  _drawEndEvent,
  _drawFlow,
  _drawAssociation,
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
              // eslint-disable-next-line no-undef
              _drawPool(pool);
            }
          }

          const modelElements = data.elements;
          for (i = 0; i < modelElements.length; i++) {
            const element = modelElements[i];
            //try {
            const drawFunction = eval("_draw" + element.type);
            // _drawStartEvent(element, paper);
            drawFunction(element, paper);
            //} catch(err) {console.log(err);}
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
