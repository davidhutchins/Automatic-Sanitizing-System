import './App.css';
import React, { Component } from 'react';
import particle from "./configs/particle";
import Particles from 'react-tsparticles';
import {Header} from './components/common';
document.title = "A.C.H.S.";


function App() {
  return (
    <div className="App">
      <Header/>
    <Particles options={particle}/>
    </div>
  );
}



// class App extends Component {
//   state = {
//       data: null
//     };
//     componentDidMount() {
//       this.callBackendAPI()
//         .then(res => this.setState({ data: res.express }))
//         .catch(err => console.log(err));
//     }
//       // fetching the GET route from the Express server which matches the GET route from server.js
//     callBackendAPI = async () => {
//       const response = await fetch('/express_backend');
//       const body = await response.json();
//       if (response.status !== 200) {
//         throw Error(body.message) 
//       }
//       return body;
//     };

//     render() {
//       return (

//           <div className="App">
//             <Header/>
//           <Particles options={particle}/>
//           </div>

//       );
//     }
//   }

  export default App;
