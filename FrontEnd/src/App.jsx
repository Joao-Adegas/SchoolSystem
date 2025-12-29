
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

  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />} >
          <Route path="/professores" element={<Professores />} />
          <Route path="/professores/:id" element={<Professores />} />
          <Route path="/disciplinas/:id" element={<Disciplinas />} />
          <Route path="/ambientes/:id" element={<Ambientes />} />
          <Route path="/diretor/:id" element={<Diretor />} />
          <Route path="/salas/:id" element={<Sala />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;