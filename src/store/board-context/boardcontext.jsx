import { createContext } from "react";
import { TOOL_ACTION_TYPE } from "../../utils/constants";
const boardContext = createContext({
  activeItem: "",
  elements: [],
  toolActionType: TOOL_ACTION_TYPE.NONE,
  handleToolItemClick: () => {},
  handleOnMouseDown: () => {},
  handleOnMouseMove: () => {},
  handleOnMouseUp: () => {},
  previousMousePosition: {
    x: 0,
    y: 0,
  },
  handleOnZoomInButton: () => {},
  handleOnZoomOutButton: () => {},
  setSize: () => {},
  canvasWidth: 0,
  canvasHeight: 0,
  textAreaBlurHandler: () => {},
});
export default boardContext;
