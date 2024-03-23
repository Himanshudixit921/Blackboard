import { getArrowCoordinates } from "./MathLogic";
import { TOOL_ITEMS } from "./constants";
import rough from "roughjs/bin/rough";
import getStroke from "perfect-freehand";
const gen = rough.generator();
export const createDrawableElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  { type, stroke, fill, size, text }
) => {
  const element = {
    id,
    x1,
    y1,
    x2,
    y2,
    type,
    fill,
    stroke,
    size,
  };
  let options = {
    seed: id + 1,
    fillStyle: "solid",
    size: size,
  };
  if (stroke) {
    options.stroke = stroke;
  }
  if (fill) {
    options.fill = fill;
  }
  options.strokeWidth = size;
  switch (type) {
    case TOOL_ITEMS.BRUSH: {
      const brushElements = {
        id,
        points: [{ x: x1, y: y1 }],
        path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
        type,
        stroke,
      };
      return brushElements;
    }
    case TOOL_ITEMS.LINE: {
      element.roughEle = gen.line(x1, y1, x2, y2, options);
      return element;
    }
    case TOOL_ITEMS.RECTANGLE: {
      element.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      return element;
    }
    case TOOL_ITEMS.ELLIPSE: {
      const centerX = (x1 + x2) / 2;
      const centerY = (y1 + y2) / 2;
      element.roughEle = gen.ellipse(
        centerX,
        centerY,
        x2 - x1,
        y2 - y1,
        options
      );
      return element;
    }
    case TOOL_ITEMS.ARROW: {
      const { x3, y3, x4, y4 } = getArrowCoordinates(x1, y1, x2, y2, 18);
      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      element.roughEle = gen.linearPath(points, options);
      return element;
    }
    case TOOL_ITEMS.TEXT: {
      console.log(text);
      if (text === undefined) element.text = "";
      else element.text = text;
      return element;
    }
    default: {
      break;
    }
  }
};
export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};
