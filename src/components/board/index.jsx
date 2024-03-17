import { useRef, useLayoutEffect, useContext, useEffect } from "react";
import rough from "roughjs";
import classes from "./index.module.css";
import boardContext from "../../store/board-context/boardcontext";
import { TOOL_ACTION_TYPE, TOOL_ITEMS } from "../../utils/constants";
import sideBarContext from "../../store/sidebar-context/sidebarcontext";
function Board() {
  // const
  const {
    elements,
    handleOnMouseMove,
    handleOnMouseDown,
    toolActionType,
    handleOnMouseUp,
    previousMousePosition,
    setSize,
    canvasHeight,
    canvasWidth,
  } = useContext(boardContext);
  const { sideBarState } = useContext(sideBarContext);
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const sendsize = () => {
      const a = canvas.height;
      const b = canvas.width;
      setSize(a, b);
    };

    sendsize();

    // eslint-disable-next-line
  }, [canvasHeight, canvasWidth]);
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);
      elements.forEach((item) => {
        if (item !== undefined) {
          switch (item.type) {
            case TOOL_ITEMS.LINE:
            case TOOL_ITEMS.ARROW:
            case TOOL_ITEMS.RECTANGLE:
            case TOOL_ITEMS.ELLIPSE:
              roughCanvas.draw(item.roughEle);
              break;
            case TOOL_ITEMS.BRUSH:
              context.fillStyle = item.stroke;
              context.fill(item.path);
              context.restore();
              break;
            default:
              throw new Error("Type undefined");
          }
        }
      });
    };

    const drawElements = () => {
      context.save();
      context.fillStyle = "black";
      const roughCanvas = rough.canvas(canvas);
      elements.forEach((item) => {
        if (item !== undefined) {
          switch (item.type) {
            case TOOL_ITEMS.LINE:
            case TOOL_ITEMS.ARROW:
            case TOOL_ITEMS.RECTANGLE:
            case TOOL_ITEMS.ELLIPSE:
              roughCanvas.draw(item.roughEle);
              break;
            case TOOL_ITEMS.BRUSH:
              context.fillStyle = item.stroke;
              context.fill(item.path);
              context.restore();
              break;
            default:
              throw new Error("Type undefined");
          }
        }
      });
    };
    resizeCanvas();
    drawElements();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      context.fillStyle = "black";
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef, elements]);
  const boardMouseDown = (event) => {
    handleOnMouseDown(event, sideBarState);
  };
  const boardMouseMove = (event) => {
    if (
      toolActionType === "DRAWING" ||
      toolActionType === TOOL_ACTION_TYPE.ERASING
    ) {
      handleOnMouseMove(event, event.clientX, event.clientY, sideBarState);
    }
    if (toolActionType === TOOL_ACTION_TYPE.DRAGGING) {
      const canvas = canvasRef.current;
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;
      canvas.style.left = `${canvas.offsetLeft + deltaX}px`;
      canvas.style.top = `${canvas.offsetTop + deltaY}px`;
      handleOnMouseMove(event, deltaX, deltaY, sideBarState);
    }
  };
  const boardMouseUp = () => {
    handleOnMouseUp();
  };
  return (
    <canvas
      className={classes.container}
      ref={canvasRef}
      id="canvas"
      onMouseDown={boardMouseDown}
      onMouseMove={boardMouseMove}
      onMouseUp={boardMouseUp}
    />
  );
}

export default Board;
