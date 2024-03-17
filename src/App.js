import Board from "./components/board/index";
import Sidebar from "./components/sidebar/sidebar";
import Toolbar from "./components/toolbox/toolbox";
import Zoombox from "./components/zoombox/zoombox";
import BoardProvider from "./store/board-context/boardProvider";
import Sidebarprovider from "./store/sidebar-context/sidebarprovider";
function App() {
  return (
    <>
      <BoardProvider>
        <Sidebarprovider>
          <Board />
          <Toolbar />
          <Sidebar />
        </Sidebarprovider>
        <Zoombox />
      </BoardProvider>
    </>
  );
}

export default App;
