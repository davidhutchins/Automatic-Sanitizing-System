import './App.css';
import particle from "./configs/particle";
import Particles from 'react-tsparticles';
import {Header} from './components/common';
document.title = "A.H.C.S.";

function App() {
  return (
    <div className="App">
      <Header/>
    <Particles options={particle}/>
    </div>
  );
}



export default App;
