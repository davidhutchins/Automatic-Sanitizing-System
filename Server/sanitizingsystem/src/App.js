import './App.css';
import particle from "./configs/particle";
import Particles from 'react-tsparticles';
import {Header} from './components/common';
document.title = "A.H.C.S.";

function App() {
  return (
    <div className="App">
      <div className='nav-container'>
      <Header/>
      </div>
    <Particles options={particle}/>
        <div className="App-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
    </div>
  );
};



export default App;
