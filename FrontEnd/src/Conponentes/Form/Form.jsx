import "../Form/Form.sass"
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";


export default function Form() {

    const navigate = useNavigate();
    // FIX: Inicializar com strings vazias ao invés de undefined
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/token/", {
                username,
                password

            });
            if (response.data.access) {

                localStorage.setItem("token", response.data.access)
                localStorage.setItem("user_type", response.data.usuario.tipo);
                localStorage.setItem("nome", response.data.usuario.nome);
                
                console.log("Username: ", response.data.usuario.username)
                console.log("Tipo Usuario: ", response.data.usuario.tipo)
                console.log("Nome: ",response.data.usuario.nome)
                console.log("token recebido: ", response.data.access)
           
                navigate("/Home"); // Voltando para navigate que é mais apropriado para SPAs
            }
            else {
                alert("Credenciais inválidas")
            }

        } catch (error) {
            alert("Erro ao fazer login", error)
        }
    };

    return (

        <div className="Container-Login">

            <div className="containerBackground">

                <div>
                    <div> <img src="/Login.svg" alt="image" srcSet="" className="img"/> </div>
                </div>

                <div className="container-form">
                    <div>
                        <h1>Login</h1>
                    </div>

                    <form action="" method="post" className="form" onSubmit={handleLogin}>

                        <input
                            type="text"
                            placeholder="Username"
                            name="Username"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            className="input"
                            onChange={(e) => setPassword(e.target.value)} />


                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </div>


        </div >
    )
}