import { useContext } from "react";
import classes from "./zoombox.module.css";
import { BsPlusLg } from "react-icons/bs";
import { LuMinus } from "react-icons/lu";
import boardContext from "../../store/board-context/boardcontext";
const Zoombox = () => {
  const { handleOnZoomInButton, handleOnZoomOutButton } =
    useContext(boardContext);
  return (
    <div className={classes.container}>
      <div className={classes.zoomitem} onClick={() => handleOnZoomInButton()}>
        <BsPlusLg />
      </div>
      <div className={classes.zoomitem} onClick={() => handleOnZoomOutButton()}>
        <LuMinus />
      </div>
    </div>
  );
};

export default Zoombox;
