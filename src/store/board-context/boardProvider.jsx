import React, { useReducer } from "react";
import boardContext from "./boardcontext";
import { TOOL_ACTION_TYPE, TOOL_ITEMS } from "../../utils/constants";
import {
  createDrawableElement,
  getSvgPathFromStroke,
} from "../../utils/Createelements";
import classes from "./cursorPointer.module.css";
import cn from "classnames";
import {
  scaledElements,
  scaledDownElements,
  scaledElementsOfBrush,
  scaledDownElementsOfBrush,
  closeToPoint,
} from "../../utils/MathLogic";
import getStroke from "perfect-freehand";
function boardStateReducer(state, action) {
  switch (action.type) {
    case "setcanvassize": {
      return {
        ...state,
        canvasHeight: action.payload.canvasHeight,
        canvasWidth: action.payload.canvasWidth,
      };
    }
    case "toolItemClick": {
      return {
        ...state,
        activeItem: action.payload.tool,
      };
    }
    case "handleMouseDown": {
      if (state.activeItem === TOOL_ITEMS.DRAG) {
        return {
          ...state,
          toolActionType: TOOL_ACTION_TYPE.DRAGGING,
          previousMousePosition: {
            x: action.payload.clientX,
            y: action.payload.clientY,
          },
        };
      }
      if (state.activeItem === TOOL_ITEMS.ERASER) {
        return {
          ...state,
          toolActionType: TOOL_ACTION_TYPE.ERASING,
        };
      }
      const { clientX, clientY } = action.payload;
      const elementChange = createDrawableElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        {
          type: state.activeItem,
          stroke: action.payload.stroke,
          fill: action.payload.fill,
          size: action.payload.size,
        }
      );
      const prevElement = state.elements;
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPE.DRAWING,
        elements: [...prevElement, elementChange],
      };
    }

    case "handleMouseMove": {
      const { clientX, clientY, deltaX, deltaY } = action.payload;
      if (state.toolActionType === TOOL_ACTION_TYPE.DRAGGING) {
        const duplicateElement = state.elements.map((item, idx) => {
          if (item.type === TOOL_ITEMS.BRUSH) {
            Object.keys(item.points).map((key) => {
              const newPoints = item.points[key];
              newPoints.x += deltaX;
              newPoints.y += deltaY;
              return newPoints;
            });
            item.path = new Path2D(
              getSvgPathFromStroke(getStroke(item.points))
            );
            return item;
          } else {
            const dup = createDrawableElement(
              idx,
              item.x1 + deltaX,
              item.y1 + deltaY,
              item.x2 + deltaX,
              item.y2 + deltaY,
              {
                type: item.type,
                stroke: item.stroke,
                fill: item.fill,
                size: item.size,
              }
            );
            return dup;
          }
        });
        return {
          ...state,
          previousMousePosition: {
            x: clientX,
            y: clientY,
          },
          elements: duplicateElement,
        };
      }
      const lastIndex = state.elements.length - 1;
      const { type } = state.elements[lastIndex];
      const duplicateElement = [...state.elements];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.ELLIPSE:
          const { x1, y1, stroke, fill, size } = duplicateElement[lastIndex];
          const element = createDrawableElement(
            lastIndex,
            x1,
            y1,
            clientX,
            clientY,
            {
              type: state.activeItem,
              stroke,
              fill,
              size,
            }
          );
          duplicateElement[lastIndex] = element;
          return {
            ...state,
            elements: duplicateElement,
          };
        case TOOL_ITEMS.BRUSH:
          duplicateElement[lastIndex].points = [
            ...duplicateElement[lastIndex].points,
            { x: clientX, y: clientY },
          ];
          duplicateElement[lastIndex].path = new Path2D(
            getSvgPathFromStroke(getStroke(duplicateElement[lastIndex].points))
          );
          return {
            ...state,
            elements: duplicateElement,
          };
        default:
          throw new Error("Type not recognized");
      }
    }
    case "handleMouseUp": {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPE.NONE,
      };
    }
    case "handleZoomInButton": {
      const duplicateElement = state.elements.map((item, idx) => {
        if (item.type === TOOL_ITEMS.BRUSH) {
          const newPoints = scaledElementsOfBrush(
            item.points,
            1.1,
            state.canvasWidth,
            state.canvasHeight
          );
          const dup = {
            ...item,
            points: newPoints,
            stroke: item.stroke,
            path: new Path2D(getSvgPathFromStroke(getStroke(newPoints))),
          };
          return dup;
        } else {
          const { x1, y1, x2, y2 } = scaledElements(
            item.x1,
            item.y1,
            item.x2,
            item.y2,
            state.canvasWidth,
            state.canvasHeight,
            1.1
          );

          const dup = createDrawableElement(idx, x1, y1, x2, y2, {
            type: item.type,
            stroke: item.stroke,
            fill: item.fill,
            size: item.size,
          });
          return dup;
        }
      });
      return {
        ...state,
        elements: duplicateElement,
      };
    }
    case "handleZoomOutButton": {
      const duplicateElement = state.elements.map((item, idx) => {
        if (item.type === TOOL_ITEMS.BRUSH) {
          const newPoints = scaledDownElementsOfBrush(
            item.points,
            1.1,
            state.canvasWidth,
            state.canvasHeight
          );
          const dup = {
            ...item,
            points: newPoints,
            stroke: item.stroke,
            path: new Path2D(getSvgPathFromStroke(getStroke(newPoints))),
          };
          return dup;
        } else {
          const { x1, y1, x2, y2 } = scaledDownElements(
            item.x1,
            item.y1,
            item.x2,
            item.y2,
            state.canvasWidth,
            state.canvasHeight,
            1.1
          );

          const dup = createDrawableElement(idx, x1, y1, x2, y2, {
            type: item.type,
            stroke: item.stroke,
            fill: item.fill,
            size: item.size,
          });
          return dup;
        }
      });

      return {
        ...state,
        elements: duplicateElement,
      };
    }
    case "erase": {
      const { clientX, clientY, size } = action.payload;
      let duplicateElement = [...state.elements];
      duplicateElement = duplicateElement.filter((element) => {
        return !closeToPoint(element, clientX, clientY, size);
      });
      return {
        ...state,
        elements: duplicateElement,
      };
    }
    default: {
      console.log("Default");
      break;
    }
  }
}
const initialBoardState = {
  activeItem: TOOL_ITEMS.BRUSH,
  toolActionType: TOOL_ACTION_TYPE.NONE,
  elements: [],
  previousMousePosition: {
    x: 0,
    y: 0,
  },
  canvasWidth: 0,
  cavasHeight: 0,
};
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardState] = useReducer(
    boardStateReducer,
    initialBoardState
  );
  const handleOnMouseDown = (event, sideBarState) => {
    dispatchBoardState({
      type: "handleMouseDown",
      payload: {
        clientX: event.clientX,
        clientY: event.clientY,
        stroke: sideBarState[boardState.activeItem]?.stroke,
        fill: sideBarState[boardState.activeItem]?.fill,
        size: sideBarState[boardState.activeItem]?.size,
      },
    });
  };
  const handleToolItemClick = ({ tool }) => {
    dispatchBoardState({
      type: "toolItemClick",
      payload: {
        tool: tool,
      },
    });
  };
  const handleOnMouseMove = (event, deltaX, deltaY, sideBarState) => {
    if (boardState.activeItem === TOOL_ITEMS.ERASER) {
      dispatchBoardState({
        type: "erase",
        payload: {
          clientX: event.clientX,
          size: sideBarState[boardState.activeItem]?.size,
          clientY: event.clientY,
        },
      });
    } else {
      dispatchBoardState({
        type: "handleMouseMove",
        payload: {
          clientX: event.clientX,
          clientY: event.clientY,
          deltaX: deltaX,
          deltaY: deltaY,
        },
      });
    }
  };
  const handleOnMouseUp = () => {
    dispatchBoardState({
      type: "handleMouseUp",
    });
  };
  const handleOnZoomInButton = () => {
    dispatchBoardState({
      type: "handleZoomInButton",
    });
  };
  const handleOnZoomOutButton = () => {
    dispatchBoardState({
      type: "handleZoomOutButton",
    });
  };
  const setSize = (canvasHeight, canvasWidth) => {
    dispatchBoardState({
      type: "setcanvassize",
      payload: {
        canvasHeight: canvasHeight,
        canvasWidth: canvasWidth,
      },
    });
  };
  const boardContextProviderValue = {
    activeItem: boardState.activeItem,
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    handleToolItemClick,
    handleOnMouseDown,
    handleOnMouseMove,
    handleOnMouseUp,
    previousMousePosition: boardState.previousMousePosition,
    handleOnZoomInButton,
    handleOnZoomOutButton,
    canvasHeight: boardState.canvasHeight,
    canvasWidth: boardState.canvasWidth,
    setSize,
  };
  return (
    <boardContext.Provider value={boardContextProviderValue}>
      <div
        className={cn(
          {
            [classes.cursorDrag]:
              boardState.activeItem === TOOL_ITEMS.DRAG &&
              boardState.toolActionType === TOOL_ACTION_TYPE.NONE,
          },
          {
            [classes.cursorDragging]:
              boardState.activeItem === TOOL_ITEMS.DRAG &&
              boardState.toolActionType === TOOL_ACTION_TYPE.DRAGGING,
          },
          {
            [classes.cursorDrawing]:
              boardState.toolActionType === TOOL_ACTION_TYPE.DRAWING &&
              boardState.activeItem !== TOOL_ITEMS.BRUSH,
          },
          {
            [classes.cursorBrush]: boardState.activeItem === TOOL_ITEMS.BRUSH,
          },
          {
            [classes.cursorErasing]:
              boardState.toolActionType === TOOL_ACTION_TYPE.ERASING,
          }
        )}
      >
        {children}
      </div>
    </boardContext.Provider>
  );
};

export default BoardProvider;
