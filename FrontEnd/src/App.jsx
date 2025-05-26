
import Layout from "./Conponentes/Layout/Layout"

import Login from "./pages/Login"
import Home from "./pages/Home";
import Professores from "./pages/Professores";
import Disciplinas from "./pages/Disciplinas";
import Ambientes from "./pages/Ambientes";
import Diretor from "./pages/Diretor";
import Sala from "./pages/Sala";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

//scss
import "./App.sass"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />} >
          <Route path="/Home" element={<Home />} />
          <Route path="/professores" element={<Professores/>} />
          <Route path="/disciplinas" element={<Disciplinas/>} />
          <Route path="/ambientes" element={<Ambientes/>} />
          <Route path="/diretor" element={<Diretor/>} />
          <Route path="/salas" element={<Sala/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;