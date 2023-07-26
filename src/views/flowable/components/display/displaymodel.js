import { _bpmnGetColor } from "@/views/flowable/components/display/bpmn-draw";

export const NORMAL_STROKE = 1;
export const SEQUENCEFLOW_STROKE = 1.5;
export const ASSOCIATION_STROKE = 2;
export const TASK_STROKE = 1;
export const TASK_HIGHLIGHT_STROKE = 2;
export const CALL_ACTIVITY_STROKE = 2;
export const ENDEVENT_STROKE = 3;

export const COMPLETED_COLOR = "#1223d3";
export const TEXT_COLOR = "#373e48";
export const CURRENT_COLOR = "#0cfd0c";
export const HOVER_COLOR = "#666666";
export const ACTIVITY_STROKE_COLOR = "#bbbbbb";
export const ACTIVITY_FILL_COLOR = "#f9f9f9";
export const MAIN_STROKE_COLOR = "#585858";

export const TEXT_PADDING = 3;
export const ARROW_WIDTH = 4;
export const MARKER_WIDTH = 12;

export const TASK_FONT = {
  font: "11px Arial",
  opacity: 1,
  // eslint-disable-next-line no-undef
  fill: Raphael.rgb(0, 0, 0),
};

// icons
export const ICON_SIZE = 16;
export const ICON_PADDING = 4;


// eslint-disable-next-line no-undef
const modelDiv = jQuery("#bpmnModel");
const historyModelId = "";
const processDefinitionId = "";
const modelType = "runtime";

// Support for custom background colors for activities
export let customActivityColors = modelDiv.attr("data-activity-color-mapping");
if (
  customActivityColors !== null &&
  customActivityColors !== undefined &&
  customActivityColors.length > 0
) {
  // Stored on the attribute as a string
  customActivityColors = JSON.parse(customActivityColors);
}

export let customActivityToolTips = modelDiv.attr("data-activity-tooltips");
if (
  customActivityToolTips !== null &&
  customActivityToolTips !== undefined &&
  customActivityToolTips.length > 0
) {
  // Stored on the attribute as a string
  customActivityToolTips = JSON.parse(customActivityToolTips);
}

// Support for custom opacity for activity backgrounds
export const customActivityBackgroundOpacity = modelDiv.attr("data-activity-opacity");

export const elementsAdded = [];
export const elementsRemoved = [];

export function _showTip(htmlNode, element) {
  // Custom tooltip
  let documentation = undefined;
  if (customActivityToolTips) {
    if (customActivityToolTips[element.name]) {
      documentation = customActivityToolTips[element.name];
    } else if (customActivityToolTips[element.id]) {
      documentation = customActivityToolTips[element.id];
    } else {
      documentation = ""; // Show nothing if custom tool tips are enabled
    }
  }

  // Default tooltip, no custom tool tip set
  if (documentation === undefined) {
    documentation = "";
    if (element.name && element.name.length > 0) {
      documentation += "<b>Name</b>: <i>" + element.name + "</i><br/><br/>";
    }

    if (element.properties) {
      for (let i = 0; i < element.properties.length; i++) {
        const propName = element.properties[i].name;
        if (
          element.properties[i].type &&
          element.properties[i].type === "list"
        ) {
          documentation += "<b>" + propName + "</b>:<br/>";
          for (let j = 0; j < element.properties[i].value.length; j++) {
            documentation +=
              "<i>" + element.properties[i].value[j] + "</i><br/>";
          }
        } else {
          documentation +=
            "<b>" +
            propName +
            "</b>: <i>" +
            element.properties[i].value +
            "</i><br/>";
        }
      }
    }
  }

  let text = element.type + " ";
  if (element.name && element.name.length > 0) {
    text += element.name;
  } else {
    text += element.id;
  }

  htmlNode.qtip({
    content: {
      text: documentation,
      title: {
        text: text,
      },
    },
    position: {
      my: "top left",
      at: "bottom center",
        // eslint-disable-next-line no-undef
      viewport: jQuery("#bpmnModel"),
    },
    hide: {
      fixed: true,
      delay: 500,
      event: "click mouseleave",
    },
    style: {
      classes: "ui-tooltip-kisbpm-bpmn",
    },
  });
}

export function _addHoverLogic(element, type, defaultColor, paper) {
  const strokeColor = _bpmnGetColor(element, defaultColor);
  let topBodyRect = null;
  if (type === "rect") {
    topBodyRect = paper.rect(
      element.x,
      element.y,
      element.width,
      element.height
    );
  } else if (type === "circle") {
    const x = element.x + element.width / 2;
    const y = element.y + element.height / 2;
    topBodyRect = paper.circle(x, y, 15);
  } else if (type === "rhombus") {
    topBodyRect = paper.path(
      "M" +
        element.x +
        " " +
        (element.y + element.height / 2) +
        "L" +
        (element.x + element.width / 2) +
        " " +
        (element.y + element.height) +
        "L" +
        (element.x + element.width) +
        " " +
        (element.y + element.height / 2) +
        "L" +
        (element.x + element.width / 2) +
        " " +
        element.y +
        "z"
    );
  }

  let opacity = 0;
  let fillColor = "#ffffff";
    // eslint-disable-next-line no-undef
  if (jQuery.inArray(element.id, elementsAdded) >= 0) {
    opacity = 0.2;
    fillColor = "green";
  }

    // eslint-disable-next-line no-undef
  if (jQuery.inArray(element.id, elementsRemoved) >= 0) {
    opacity = 0.2;
    fillColor = "red";
  }

  topBodyRect.attr({
    opacity: opacity,
    stroke: "none",
    fill: fillColor,
  });
  // eslint-disable-next-line no-undef
  _showTip(jQuery(topBodyRect.node), element);

  topBodyRect.mouseover(function () {
    paper.getById(element.id).attr({ stroke: HOVER_COLOR });
  });

  topBodyRect.mouseout(function () {
    paper.getById(element.id).attr({ stroke: strokeColor });
  });
}

export function _zoom(zoomIn, paper, canvasWidth, canvasHeight) {
  let tmpCanvasWidth, tmpCanvasHeight;
  if (zoomIn) {
    tmpCanvasWidth = canvasWidth * (1.0 / 0.9);
    tmpCanvasHeight = canvasHeight * (1.0 / 0.9);
  } else {
    tmpCanvasWidth = canvasWidth * (1.0 / 1.1);
    tmpCanvasHeight = canvasHeight * (1.0 / 1.1);
  }

  if (tmpCanvasWidth !== canvasWidth || tmpCanvasHeight !== canvasHeight) {
    canvasWidth = tmpCanvasWidth;
    canvasHeight = tmpCanvasHeight;
    paper.setSize(canvasWidth, canvasHeight);
  }
}
