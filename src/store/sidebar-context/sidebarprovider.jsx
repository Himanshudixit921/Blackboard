import React, { useReducer } from "react";
import { COLORS, SIDE_BAR_ACTION, TOOL_ITEMS } from "../../utils/constants";
import sideBarContext from "./sidebarcontext";
function sideBarReducer(state, action) {
  switch (action.type) {
    case SIDE_BAR_ACTION.CHANGE_STROKE: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          stroke: action.payload.stroke,
        },
      };
    }
    case SIDE_BAR_ACTION.CHANGE_FILL: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          fill: action.payload.fill,
        },
      };
    }
    case SIDE_BAR_ACTION.CHANGE_SIZE: {
      return {
        ...state,
        [action.payload.tool]: {
          ...state[action.payload.tool],
          size: action.payload.size,
        },
      };
    }
    default: {
      return {};
    }
  }
}
const initialSideBarState = {
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.WHITE,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.WHITE,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ELLIPSE]: {
    stroke: COLORS.WHITE,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.WHITE,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.WHITE,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ERASER]: {
    size: 1,
    fill: null,
  },
  [TOOL_ITEMS.TEXT]: {
    size: 35,
    stroke: COLORS.WHITE,
  },
};
const Sidebarprovider = ({ children }) => {
  const [sideBarState, dispatchSideBarState] = useReducer(
    sideBarReducer,
    initialSideBarState
  );
  const handleStrokeChange = (tool, stroke) => {
    dispatchSideBarState({
      type: SIDE_BAR_ACTION.CHANGE_STROKE,
      payload: {
        tool,
        stroke,
      },
    });
  };
  const handleChangeFill = (tool, fill) => {
    dispatchSideBarState({
      type: SIDE_BAR_ACTION.CHANGE_FILL,
      payload: {
        tool,
        fill,
      },
    });
  };
  const handleChangeSize = (tool, size) => {
    dispatchSideBarState({
      type: SIDE_BAR_ACTION.CHANGE_SIZE,
      payload: {
        tool,
        size,
      },
    });
  };
  const sideBarContextValue = {
    sideBarState,
    handleStrokeChange,
    handleChangeFill,
    handleChangeSize,
  };
  return (
    <sideBarContext.Provider value={sideBarContextValue}>
      {children}
    </sideBarContext.Provider>
  );
};

export default Sidebarprovider;
