import { TOOL_ITEMS } from "./constants";
import { ELEMENT_ERASE_THRESHOLD } from "./constants";
// coordinates bhejega arrow ke
export const getArrowCoordinates = (x1, y1, x2, y2, arrowLength) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const x3 = x2 - arrowLength * Math.cos(angle - Math.PI / 8);
  const y3 = y2 - arrowLength * Math.sin(angle - Math.PI / 8);
  const x4 = x2 - arrowLength * Math.cos(angle + Math.PI / 8);
  const y4 = y2 - arrowLength * Math.sin(angle + Math.PI / 8);
  return {
    x3,
    y3,
    x4,
    y4,
  };
};
export const scaledElements = (
  startX,
  startY,
  endX,
  endY,
  canvasWidth,
  canvasHeight,
  scaleFactor
) => {
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // Calculate translated coordinates
  const translatedStartX = startX - canvasCenterX;
  const translatedStartY = startY - canvasCenterY;
  const translatedEndX = endX - canvasCenterX;
  const translatedEndY = endY - canvasCenterY;

  // Scale the translated coordinates
  const scaledStartX = translatedStartX * scaleFactor;
  const scaledStartY = translatedStartY * scaleFactor;
  const scaledEndX = translatedEndX * scaleFactor;
  const scaledEndY = translatedEndY * scaleFactor;

  // Calculate final coordinates by adding the center coordinates back
  const finalStartX = scaledStartX + canvasCenterX;
  const finalStartY = scaledStartY + canvasCenterY;
  const finalEndX = scaledEndX + canvasCenterX;
  const finalEndY = scaledEndY + canvasCenterY;

  return {
    x1: finalStartX,
    y1: finalStartY,
    x2: finalEndX,
    y2: finalEndY,
  };
};
export const scaledElementsOfBrush = (
  points,
  scaleFactor,
  canvasWidth,
  canvasHeight
) => {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Scale points around the center
  const scaledPoints = points.map((point) => ({
    x: centerX + (point.x - centerX) * scaleFactor,
    y: centerY + (point.y - centerY) * scaleFactor,
  }));

  return scaledPoints;
};
export const scaledDownElementsOfBrush = (
  points,
  scaleFactor,
  canvasWidth,
  canvasHeight
) => {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const scaledPoints = points.map((point) => ({
    x: centerX + (point.x - centerX) / scaleFactor,
    y: centerY + (point.y - centerY) / scaleFactor,
  }));

  return scaledPoints;
};
export const scaledDownElements = (
  startX,
  startY,
  endX,
  endY,
  canvasWidth,
  canvasHeight,
  scaleFactor
) => {
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // Calculate translated coordinates
  const translatedStartX = startX - canvasCenterX;
  const translatedStartY = startY - canvasCenterY;
  const translatedEndX = endX - canvasCenterX;
  const translatedEndY = endY - canvasCenterY;

  // Scale down the translated coordinates
  const scaledStartX = translatedStartX / scaleFactor;
  const scaledStartY = translatedStartY / scaleFactor;
  const scaledEndX = translatedEndX / scaleFactor;
  const scaledEndY = translatedEndY / scaleFactor;

  // Calculate final coordinates by adding the center coordinates back
  const finalStartX = scaledStartX + canvasCenterX;
  const finalStartY = scaledStartY + canvasCenterY;
  const finalEndX = scaledEndX + canvasCenterX;
  const finalEndY = scaledEndY + canvasCenterY;

  return {
    x1: finalStartX,
    y1: finalStartY,
    x2: finalEndX,
    y2: finalEndY,
  };
};

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY, size) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return (
    Math.abs(distToStart + distToEnd - distLine) <
    Math.max(ELEMENT_ERASE_THRESHOLD.LINE * size, 1)
  );
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,

    y: p1.y + (p2.y - p1.y) / 2,
  };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};
export const closeToPoint = (element, pointX, pointY, size) => {
  const { x1, y1, x2, y2 } = element;
  switch (element.type) {
    case TOOL_ITEMS.LINE:
    case TOOL_ITEMS.ARROW:
      return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY, size);
    case TOOL_ITEMS.RECTANGLE:
    case TOOL_ITEMS.ELLIPSE:
      return (
        isPointCloseToLine(x1, y1, x2, y1, pointX, pointY, size) ||
        isPointCloseToLine(x2, y1, x2, y2, pointX, pointY, size) ||
        isPointCloseToLine(x2, y2, x1, y2, pointX, pointY, size) ||
        isPointCloseToLine(x1, y2, x1, y1, pointX, pointY, size)
      );
    case TOOL_ITEMS.BRUSH:
      const context = document.getElementById("canvas").getContext("2d");
      return context.isPointInPath(element.path, pointX, pointY);
    default:
      return false;
  }
};
