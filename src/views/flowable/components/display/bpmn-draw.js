import {
  NORMAL_STROKE,
  SEQUENCEFLOW_STROKE,
  ASSOCIATION_STROKE,
  TASK_STROKE,
  TASK_HIGHLIGHT_STROKE,
  CALL_ACTIVITY_STROKE,
  ENDEVENT_STROKE,
  COMPLETED_COLOR,
  TEXT_COLOR,
  CURRENT_COLOR,
  HOVER_COLOR,
  ACTIVITY_STROKE_COLOR,
  ACTIVITY_FILL_COLOR,
  MAIN_STROKE_COLOR,
  TEXT_PADDING,
  ARROW_WIDTH,
  MARKER_WIDTH,
  customActivityColors,
  customActivityToolTips,
  customActivityBackgroundOpacity,
  _showTip,
  _addHoverLogic, _zoom,
} from "@/views/flowable/components/display/displaymodel";
import { Polyline } from "@/views/flowable/components/display/Polyline";
import {
  _drawBusinessRuleTaskIcon, _drawCamelTaskIcon, _drawDecisionTaskIcon,
  _drawEventIcon, _drawHttpTaskIcon, _drawManualTaskIcon, _drawMuleTaskIcon,
  _drawReceiveTaskIcon,
  _drawScriptTaskIcon, _drawSendTaskIcon, _drawServiceTaskIcon, _drawShellTaskIcon, _drawUserTaskIcon
} from "@/views/flowable/components/display/bpmn-icons";

let strokeWidth;

export function _bpmnGetColor(element, defaultColor) {
  let strokeColor;
  if (element.current) {
    strokeColor = CURRENT_COLOR;
  } else if (element.completed) {
    strokeColor = COMPLETED_COLOR;
  } else {
    strokeColor = defaultColor;
  }
  return strokeColor;
}

export function _drawPool(pool,paper) {
  const rect = paper.rect(pool.x, pool.y, pool.width, pool.height);

  rect.attr({ "stroke-width": 1, stroke: "#000000", fill: "white" });

  if (pool.name) {
    const poolName = paper
      .text(pool.x + 14, pool.y + pool.height / 2, pool.name)
      .attr({
        "text-anchor": "middle",
        "font-family": "Arial",
        "font-size": "12",
        fill: "#000000",
      });

    poolName.transform("r270");
  }

  if (pool.lanes) {
    for (let i = 0; i < pool.lanes.length; i++) {
      const lane = pool.lanes[i];
      _drawLane(lane);
    }
  }
}

export function _drawLane(lane,paper) {
  const rect = paper.rect(lane.x, lane.y, lane.width, lane.height);

  rect.attr({ "stroke-width": 1, stroke: "#000000", fill: "white" });

  if (lane.name) {
    const laneName = paper
      .text(lane.x + 10, lane.y + lane.height / 2, lane.name)
      .attr({
        "text-anchor": "middle",
        "font-family": "Arial",
        "font-size": "12",
        fill: "#000000",
      });

    laneName.transform("r270");
  }
}

export function _drawSubProcess(element,paper) {
  const rect = paper.rect(
    element.x,
    element.y,
    element.width,
    element.height,
    4
  );
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  rect.attr({ "stroke-width": 1, stroke: strokeColor, fill: "white" });
}

export function _drawTransaction(element,paper) {
  const rect = paper.rect(
    element.x,
    element.y,
    element.width,
    element.height,
    4
  );

  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  rect.attr({ "stroke-width": 1, stroke: strokeColor, fill: "white" });

  const borderRect = paper.rect(
    element.x + 2,
    element.y + 2,
    element.width - 4,
    element.height - 4,
    4
  );

  borderRect.attr({ "stroke-width": 1, stroke: "black", fill: "none" });
}

export function _drawEventSubProcess(element,paper) {
  const rect = paper.rect(
    element.x,
    element.y,
    element.width,
    element.height,
    4
  );
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  rect.attr({
    "stroke-width": 1,
    stroke: strokeColor,
    "stroke-dasharray": ".",
    fill: "white",
  });
}

export function _drawAdhocSubProcess(element,paper) {
  const rect = paper.rect(
    element.x,
    element.y,
    element.width,
    element.height,
    4
  );

  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  rect.attr({ "stroke-width": 1, stroke: strokeColor, fill: "white" });
  paper
    .text(element.x + element.width / 2, element.y + element.height - 8)
    .attr({
      "text-anchor": "middle",
      "font-family": "Arial",
      "font-size": 20,
      text: "~",
      fill: "#373e48",
    });
}

export function _drawStartEvent(element, paper) {
  const startEvent = _drawEvent(element, NORMAL_STROKE, 15, paper);
  startEvent.click(function () {
    _zoom(true, paper);
  });
  _addHoverLogic(element, "circle", MAIN_STROKE_COLOR, paper);
}

export function _drawEndEvent(element, paper) {
  const endEvent = _drawEvent(element, ENDEVENT_STROKE, 14,paper);
  endEvent.click(function () {
    _zoom(false, paper);
  });
  _addHoverLogic(element, "circle", MAIN_STROKE_COLOR, paper);
}

export function _drawEvent(element, strokeWidth, radius, paper) {
  const x = element.x + element.width / 2;
  const y = element.y + element.height / 2;

  const circle = paper.circle(x, y, radius);

  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  // Fill
  const eventFillColor = _determineCustomFillColor(element, "#ffffff");

  // Opacity
  let eventOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    eventOpacity = customActivityBackgroundOpacity;
  }

  if (element.interrupting === undefined || element.interrupting) {
    circle.attr({
      "stroke-width": strokeWidth,
      stroke: strokeColor,
      fill: eventFillColor,
      "fill-opacity": eventOpacity,
    });
  } else {
    circle.attr({
      "stroke-width": strokeWidth,
      stroke: strokeColor,
      "stroke-dasharray": ".",
      fill: eventFillColor,
      "fill-opacity": eventOpacity,
    });
  }

  circle.id = element.id;

  _drawEventIcon(paper, element);

  return circle;
}

export function _drawServiceTask(element, paper) {
  _drawTask(element,paper);
  if (element.taskType === "mail") {
    _drawSendTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.taskType === "camel") {
    _drawCamelTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.taskType === "mule") {
    _drawMuleTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.taskType === "http") {
    _drawHttpTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.taskType === "shell") {
    _drawShellTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.taskType === "dmn") {
    _drawDecisionTaskIcon(paper, element.x + 4, element.y + 4);
  } else if (element.stencilIconId) {
    paper.image(
      "../service/stencilitem/" + element.stencilIconId + "/icon",
      element.x + 4,
      element.y + 4,
      16,
      16
    );
  } else {
    _drawServiceTaskIcon(paper, element.x + 4, element.y + 4);
  }
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawSendEventServiceTask(element, paper) {
  _drawTask(element,paper);
  _drawSendTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawExternalWorkerServiceTask(element, paper) {
  _drawTask(element,paper);
  _drawServiceTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawHttpServiceTask(element, paper) {
  _drawTask(element,paper);
  _drawHttpTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawCallActivity(element, paper) {
  const width = element.width - CALL_ACTIVITY_STROKE / 2;
  const height = element.height - CALL_ACTIVITY_STROKE / 2;

  const rect = paper.rect(element.x, element.y, width, height, 4);
  const strokeColor = _bpmnGetColor(element, ACTIVITY_STROKE_COLOR);

  // Fill
  const callActivityFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let callActivityOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    callActivityOpacity = customActivityBackgroundOpacity;
  }

  rect.attr({
    "stroke-width": CALL_ACTIVITY_STROKE,
    stroke: strokeColor,
    fill: callActivityFillColor,
    "fill-opacity": callActivityOpacity,
  });

  rect.id = element.id;

  if (element.name) {
    _drawMultilineText(
      element.name,
      element.x,
      element.y,
      element.width,
      element.height,
      "middle",
      "middle",
      11,
      paper
    );
  }
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawScriptTask(element, paper) {
  _drawTask(element,paper);
  _drawScriptTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawUserTask(element, paper) {
  _drawTask(element, paper);
  _drawUserTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawBusinessRuleTask(element, paper) {
  _drawTask(element,paper);
  _drawBusinessRuleTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawManualTask(element, paper) {
  _drawTask(element,paper);
  _drawManualTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawSendTask(element, paper) {
  _drawTask(element,paper);
  _drawSendTaskIcon(paper, element.x + 4, element.y + 4);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawReceiveTask(element, paper) {
  _drawTask(element,paper);
  _drawReceiveTaskIcon(paper, element.x, element.y);
  _addHoverLogic(element, "rect", ACTIVITY_STROKE_COLOR, paper);
}

export function _drawTask(element,paper) {
  const rectAttrs = {};

  // Stroke
  const strokeColor = _bpmnGetColor(element, ACTIVITY_STROKE_COLOR);
  rectAttrs["stroke"] = strokeColor;

  if (strokeColor === ACTIVITY_STROKE_COLOR) {
    strokeWidth = TASK_STROKE;
  } else {
    strokeWidth = TASK_HIGHLIGHT_STROKE;
  }

  const width = element.width - strokeWidth / 2;
  const height = element.height - strokeWidth / 2;
  const rect = paper.rect(element.x, element.y, width, height, 4);
  rectAttrs["stroke-width"] = strokeWidth;

  // Fill
  const fillColor = _determineCustomFillColor(element, ACTIVITY_FILL_COLOR);
  rectAttrs["fill"] = fillColor;

  // Opacity
  if (customActivityBackgroundOpacity) {
    rectAttrs["fill-opacity"] = customActivityBackgroundOpacity;
  }

  rect.attr(rectAttrs);
  rect.id = element.id;

  if (element.name) {
    _drawMultilineText(
      element.name,
      element.x,
      element.y,
      element.width,
      element.height,
      "middle",
      "middle",
      11,
      paper
    );
  }
}

export function _drawExclusiveGateway(element, paper) {
  _drawGateway(element,paper);
  const quarterWidth = element.width / 4;
  const quarterHeight = element.height / 4;
  const iks = paper.path(
    "M" +
      (element.x + quarterWidth + 3) +
      " " +
      (element.y + quarterHeight + 3) +
      "L" +
      (element.x + 3 * quarterWidth - 3) +
      " " +
      (element.y + 3 * quarterHeight - 3) +
      "M" +
      (element.x + quarterWidth + 3) +
      " " +
      (element.y + 3 * quarterHeight - 3) +
      "L" +
      (element.x + 3 * quarterWidth - 3) +
      " " +
      (element.y + quarterHeight + 3)
  );
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  // Fill
  const gatewayFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let gatewayOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    gatewayOpacity = customActivityBackgroundOpacity;
  }

  iks.attr({
    "stroke-width": 3,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
  });
  _addHoverLogic(element, "rhombus", MAIN_STROKE_COLOR, paper);
}

export function _drawParallelGateway(element, paper) {
  _drawGateway(element);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);
  const path1 = paper.path("M 6.75,16 L 25.75,16 M 16,6.75 L 16,25.75");

  // Fill
  const gatewayFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let gatewayOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    gatewayOpacity = customActivityBackgroundOpacity;
  }

  path1.attr({
    "stroke-width": 3,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
  });

  path1.transform("T" + (element.x + 4) + "," + (element.y + 4));
  _addHoverLogic(element, "rhombus", MAIN_STROKE_COLOR, paper);
}

export function _drawInclusiveGateway(element, paper) {
  _drawGateway(element);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);
  const circle1 = paper.circle(
    element.x + element.width / 2,
    element.y + element.height / 2,
    9.75
  );

  // Fill
  const gatewayFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let gatewayOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    gatewayOpacity = customActivityBackgroundOpacity;
  }

  circle1.attr({
    "stroke-width": 2.5,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
  });
  _addHoverLogic(element, "rhombus", MAIN_STROKE_COLOR, paper);
}

export function _drawEventGateway(element, paper) {
  _drawGateway(element);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);
  const circle1 = paper.circle(
    element.x + element.width / 2,
    element.y + element.height / 2,
    10.4
  );

  // Fill
  const gatewayFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let gatewayOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    gatewayOpacity = customActivityBackgroundOpacity;
  }

  circle1.attr({
    "stroke-width": 0.5,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
  });
  const circle2 = paper.circle(
    element.x + element.width / 2,
    element.y + element.height / 2,
    11.7
  );
  circle2.attr({
    "stroke-width": 0.5,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
  });
  const path1 = paper.path(
    "M 20.327514,22.344972 L 11.259248,22.344216 L 8.4577203,13.719549 L 15.794545,8.389969 L 23.130481,13.720774 L 20.327514,22.344972 z"
  );
  path1.attr({
    "stroke-width": 1.39999998,
    stroke: strokeColor,
    fill: gatewayFillColor,
    "fill-opacity": gatewayOpacity,
    "stroke-linejoin": "bevel",
  });

  path1.transform("T" + (element.x + 4) + "," + (element.y + 4));
  _addHoverLogic(element, "rhombus", MAIN_STROKE_COLOR, paper);
}

export function _drawGateway(element,paper) {
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);
  const rhombus = paper.path(
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

  // Fill
  const gatewayFillColor = _determineCustomFillColor(
    element,
    ACTIVITY_FILL_COLOR
  );

  // Opacity
  let gatewayOpacity = 1.0;
  if (customActivityBackgroundOpacity) {
    gatewayOpacity = customActivityBackgroundOpacity;
  }

  rhombus.attr("stroke-width", 2);
  rhombus.attr("stroke", strokeColor);
  rhombus.attr("fill", gatewayFillColor);
  rhombus.attr("fill-opacity", gatewayOpacity);

  rhombus.id = element.id;

  return rhombus;
}

export function _drawBoundaryEvent(element, paper) {
  const x = element.x + element.width / 2;
  const y = element.y + element.height / 2;
  const circle = paper.circle(x, y, 15);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  if (element.cancelActivity) {
    circle.attr({
      "stroke-width": 1,
      stroke: strokeColor,
      fill: "white",
    });
  } else {
    circle.attr({
      "stroke-width": 1,
      "stroke-dasharray": ".",
      stroke: strokeColor,
      fill: "white",
    });
  }
  const innerCircle = paper.circle(x, y, 12);

  if (element.cancelActivity) {
    innerCircle.attr({ "stroke-width": 1, stroke: strokeColor, fill: "none" });
  } else {
    innerCircle.attr({
      "stroke-width": 1,
      "stroke-dasharray": ".",
      stroke: strokeColor,
      fill: "none",
    });
  }
  _drawEventIcon(paper, element);
  _addHoverLogic(element, "circle", MAIN_STROKE_COLOR, paper);

  circle.id = element.id;
  innerCircle.id = element.id + "_inner";
}

export function _drawIntermediateCatchEvent(element, paper) {
  const x = element.x + element.width / 2;
  const y = element.y + element.height / 2;
  const circle = paper.circle(x, y, 15);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  circle.attr({ "stroke-width": 1, stroke: strokeColor, fill: "white" });
  const innerCircle = paper.circle(x, y, 12);

  innerCircle.attr({ "stroke-width": 1, stroke: strokeColor, fill: "none" });
  _drawEventIcon(paper, element);
  _addHoverLogic(element, "circle", MAIN_STROKE_COLOR, paper);

  circle.id = element.id;
  innerCircle.id = element.id + "_inner";
}

export function _drawThrowEvent(element, paper) {
  const x = element.x + element.width / 2;
  const y = element.y + element.height / 2;
  const circle = paper.circle(x, y, 15);
  const strokeColor = _bpmnGetColor(element, MAIN_STROKE_COLOR);

  circle.attr({ "stroke-width": 1, stroke: strokeColor, fill: "white" });
  const innerCircle = paper.circle(x, y, 12);

  innerCircle.attr({ "stroke-width": 1, stroke: strokeColor, fill: "none" });
  _drawEventIcon(paper, element);
  _addHoverLogic(element, "circle", MAIN_STROKE_COLOR, paper);

  circle.id = element.id;
  innerCircle.id = element.id + "_inner";
}

export function _drawMultilineText(
  text,
  x,
  y,
  boxWidth,
  boxHeight,
  horizontalAnchor,
  verticalAnchor,
  fontSize,
  paper
) {
  if (!text || text === "") {
    return;
  }

  let textBoxX;
  const width = boxWidth - 2 * TEXT_PADDING;

  if (horizontalAnchor === "middle") {
    textBoxX = x + boxWidth / 2;
  } else if (horizontalAnchor === "start") {
    textBoxX = x;
  }
  const textBoxY = y + boxHeight / 2;
  const t = paper.text(textBoxX + TEXT_PADDING, textBoxY + TEXT_PADDING).attr({
    "text-anchor": horizontalAnchor,
    "font-family": "Arial",
    "font-size": fontSize,
    fill: "#373e48",
  });

  const abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  t.attr({
    text: abc,
  });
  const letterWidth = t.getBBox().width / abc.length;

  t.attr({
    text: text,
  });
  const removedLineBreaks = text.split("\n");
  // eslint-disable-next-line no-var,no-redeclare
  var x = 0,
    s = [];
  for (let r = 0; r < removedLineBreaks.length; r++) {
    const words = removedLineBreaks[r].split(" ");
    for (let i = 0; i < words.length; i++) {
      const l = words[i].length;
      if (x + l * letterWidth > width) {
        s.push("\n");
        x = 0;
      }
      x += l * letterWidth;
      s.push(words[i] + " ");
    }
    s.push("\n");
    x = 0;
  }
  t.attr({
    text: s.join(""),
  });

  if (verticalAnchor && verticalAnchor === "top") {
    t.attr({ y: y + t.getBBox().height / 2 });
  }
}

export function _drawTextAnnotation(element,paper) {
  const path1 = paper.path("M20,1 L1,1 L1,50 L20,50");
  path1.attr({
    stroke: "#585858",
    fill: "none",
  });
  const annotation = paper.set();
  annotation.push(path1);

  annotation.transform("T" + element.x + "," + element.y);

  if (element.text) {
    _drawMultilineText(
      element.text,
      element.x + 2,
      element.y,
      element.width,
      element.height,
      "start",
      "middle",
      11,
      paper
    );
  }
}

export function _drawFlow(flow, paper) {
  const polyline = new Polyline(
    flow.id,
    flow.waypoints,
    SEQUENCEFLOW_STROKE,
    paper
  );
  const strokeColor = _bpmnGetColor(flow, MAIN_STROKE_COLOR);
  polyline.element = paper.path(polyline.path);
  polyline.element.attr({ "stroke-width": SEQUENCEFLOW_STROKE });
  polyline.element.attr({ stroke: strokeColor });

  polyline.element.id = flow.id;

  const lastLineIndex = polyline.getLinesCount() - 1;
  const line = polyline.getLine(lastLineIndex);

  if (line === undefined) return;

  if (flow.type === "connection" && flow.conditions) {
    const middleX = (line.x1 + line.x2) / 2;
    const middleY = (line.y1 + line.y2) / 2;
    const image = paper.image(
      "../editor/images/condition-flow.png",
      middleX - 8,
      middleY - 8,
      16,
      16
    );
  }
  const polylineInvisible = new Polyline(
    flow.id,
    flow.waypoints,
    SEQUENCEFLOW_STROKE,
    paper
  );
  polylineInvisible.element = paper.path(polyline.path);
  polylineInvisible.element.attr({
    opacity: 0,
    "stroke-width": 8,
    stroke: "#000000",
  });

  if (flow.name) {
    const firstLine = polyline.getLine(0);

    let angle;
    if (firstLine.x1 !== firstLine.x2) {
      angle = Math.atan(
        (firstLine.y2 - firstLine.y1) / (firstLine.x2 - firstLine.x1)
      );
    } else if (firstLine.y1 < firstLine.y2) {
      angle = Math.PI / 2;
    } else {
      angle = -Math.PI / 2;
    }
    const flowName = paper.text(firstLine.x1, firstLine.y1, flow.name).attr({
      "text-anchor": "middle",
      "font-family": "Arial",
      "font-size": "12",
      fill: "#000000",
    });

    let offsetX = flowName.getBBox().width / 2 + 5;
    const offsetY = -(flowName.getBBox().height / 2 + 5);

    if (firstLine.x1 > firstLine.x2) {
      offsetX = -offsetX;
    }
    const rotatedOffsetX =
      offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
    const rotatedOffsetY =
      offsetX * Math.sin(angle) + offsetY * Math.cos(angle);

    flowName.attr({
      x: firstLine.x1 + rotatedOffsetX,
      y: firstLine.y1 + rotatedOffsetY,
    });

    flowName.transform("r" + (angle * 180) / Math.PI);
  }
  // eslint-disable-next-line no-undef
  _showTip(jQuery(polylineInvisible.element.node), flow);

  polylineInvisible.element.mouseover(function () {
    paper.getById(polyline.element.id).attr({ stroke: "blue" });
  });

  polylineInvisible.element.mouseout(function () {
    paper.getById(polyline.element.id).attr({ stroke: "#585858" });
  });

  _drawArrowHead(line,undefined,paper);
}

export function _drawAssociation(flow, paper) {
  const polyline = new Polyline(
    flow.id,
    flow.waypoints,
    ASSOCIATION_STROKE,
    paper
  );
  polyline.element = paper.path(polyline.path);
  polyline.element.attr({ "stroke-width": ASSOCIATION_STROKE });
  polyline.element.attr({ "stroke-dasharray": ". " });
  polyline.element.attr({ stroke: "#585858" });

  polyline.element.id = flow.id;
  const polylineInvisible = new Polyline(
    flow.id,
    flow.waypoints,
    ASSOCIATION_STROKE,
    paper
  );
  polylineInvisible.element = paper.path(polyline.path);
  polylineInvisible.element.attr({
    opacity: 0,
    "stroke-width": 8,
    stroke: "#000000",
  });
  // eslint-disable-next-line no-undef
  _showTip(jQuery(polylineInvisible.element.node), flow);

  polylineInvisible.element.mouseover(function () {
    paper.getById(polyline.element.id).attr({ stroke: "blue" });
  });

  polylineInvisible.element.mouseout(function () {
    paper.getById(polyline.element.id).attr({ stroke: "#585858" });
  });
}

export function _drawArrowHead(line, connectionType,paper) {
  const doubleArrowWidth = 2 * ARROW_WIDTH;
  const arrowHead = paper.path(
    "M0 0L-" +
      (ARROW_WIDTH / 2 + 0.5) +
      " -" +
      doubleArrowWidth +
      "L" +
      (ARROW_WIDTH / 2 + 0.5) +
      " -" +
      doubleArrowWidth +
      "z"
  );

  // anti smoothing
  if (strokeWidth % 2 === 1) (line.x2 += 0.5), (line.y2 += 0.5);

  arrowHead.transform("t" + line.x2 + "," + line.y2 + "");
  arrowHead.transform(
      // eslint-disable-next-line no-undef
    "...r" + Raphael.deg(line.angle - Math.PI / 2) + " " + 0 + " " + 0
  );

  arrowHead.attr("fill", "#585858");
  arrowHead.attr("stroke-width", SEQUENCEFLOW_STROKE);
  arrowHead.attr("stroke", "#585858");

  return arrowHead;
}

export function _determineCustomFillColor(element, defaultColor) {
  let color;

  // By name
  if (customActivityColors && customActivityColors[element.name]) {
    color = customActivityColors[element.name];
  }

  if (color !== null && color !== undefined) {
    return color;
  }

  // By id
  if (customActivityColors && customActivityColors[element.id]) {
    color = customActivityColors[element.id];
  }

  if (color !== null && color !== undefined) {
    return color;
  }

  return defaultColor;
}
