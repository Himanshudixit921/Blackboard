import React, { useContext } from "react";
import classes from "./sidebar.module.css";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../utils/constants";
import cx from "classnames";
import sideBarContext from "../../store/sidebar-context/sidebarcontext";
import boardContext from "../../store/board-context/boardcontext";
import { STROKE_TOOL_TYPES } from "../../utils/constants";
const Sidebar = () => {
  const { activeItem } = useContext(boardContext);
  const {
    sideBarState,
    handleStrokeChange,
    handleChangeFill,
    handleChangeSize,
  } = useContext(sideBarContext);
  const StrokeColor = sideBarState[activeItem]?.stroke;
  const FillColor = sideBarState[activeItem]?.fill;
  const size = sideBarState[activeItem]?.size;
  return (
    <div key={activeItem} className={classes.container}>
      {STROKE_TOOL_TYPES.includes(activeItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Stroke</div>
          <div className={classes.colorsContainer}>
            {Object.keys(COLORS).map((key) => {
              return (
                <div
                  key={key}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: StrokeColor === COLORS[key],
                  })}
                  style={{ backgroundColor: COLORS[key] }}
                  onClick={() => handleStrokeChange(activeItem, COLORS[key])}
                ></div>
              );
            })}
          </div>
        </div>
      )}
      {FILL_TOOL_TYPES.includes(activeItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Fill</div>
          <div className={classes.colorsContainer}>
            {Object.keys(COLORS).map((key) => {
              return (
                <div
                  key={key}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: FillColor === COLORS[key],
                  })}
                  style={{ backgroundColor: COLORS[key] }}
                  onClick={() => handleChangeFill(activeItem, COLORS[key])}
                ></div>
              );
            })}
          </div>
        </div>
      )}
      {SIZE_TOOL_TYPES.includes(activeItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Brush Size</div>
          <input
            type="range"
            step={1}
            value={size}
            onChange={(event) =>
              handleChangeSize(activeItem, event.target.value)
            }
          />
        </div>
      )}
      {activeItem === TOOL_ITEMS.ERASER && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>Eraser Size</div>
          <input
            type="range"
            step={1}
            value={size}
            onChange={(event) =>
              handleChangeSize(activeItem, event.target.value)
            }
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
