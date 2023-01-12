import Grid from './components/Grid';
import Navbar from './components/Navbar';
import { GameProvider } from './GameContext';

function App() {
  return (
    <div className="bg-indigo-900 h-screen w-screen ">
      <GameProvider>
        <Navbar></Navbar>
        <div className="content flex flex-col justify-center items-center">
          <Grid></Grid>
        </div>
      </GameProvider>
    </div>
  );
}

export default App;
