import { createContext } from "react";
const sideBarContext = createContext({
  sideBarState: "",
  handleStrokeChange: () => {},
  handleChangeFill: () => {},
  handleChangeSize: () => {},
});
export default sideBarContext;

// fill property
// fillstyle property
// stroke property
// strokeWidth
// strokeLineDash
// strokeLineDashOffset
