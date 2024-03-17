import { useContext } from "react";
import classes from "./toolbox.module.css";
import { TbBackslash } from "react-icons/tb";
import { PiRectangle } from "react-icons/pi";
import { IoEllipseOutline } from "react-icons/io5";
import { RiDragMoveFill } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { FaPaintBrush } from "react-icons/fa";
import { LuEraser } from "react-icons/lu";
import cn from "classnames";
import { TOOL_ITEMS } from "../../utils/constants";
import boardContext from "../../store/board-context/boardcontext";

function Toolbar() {
  const { activeItem, handleToolItemClick } = useContext(boardContext);
  return (
    <div className={classes.container}>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.BRUSH })}
      >
        <div className={classes.itemname} data-info={"Brush"}>
          <FaPaintBrush />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.LINE,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.LINE })}
      >
        <div className={classes.itemname} data-info={"Line"}>
          <TbBackslash />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.RECTANGLE })}
      >
        <div className={classes.itemname} data-info={"Rectangle"}>
          <PiRectangle />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.ELLIPSE,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.ELLIPSE })}
      >
        <div className={classes.itemname} data-info={"Ellipse"}>
          <IoEllipseOutline />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.ARROW,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.ARROW })}
      >
        <div className={classes.itemname} data-info={"Arrow"}>
          <GoArrowRight />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.DRAG,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.DRAG })}
      >
        <div className={classes.itemname} data-info={"Drag"}>
          <RiDragMoveFill />
        </div>
      </div>
      <div
        className={cn(classes.toolitem, {
          [classes.active]: activeItem === TOOL_ITEMS.ERASER,
        })}
        onClick={() => handleToolItemClick({ tool: TOOL_ITEMS.ERASER })}
      >
        <div className={classes.itemname} data-info={"Eraser"}>
          <LuEraser />
        </div>
      </div>
    </div>
  );
}
export default Toolbar;
