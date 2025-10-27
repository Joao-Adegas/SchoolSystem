import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";

import axios from "axios";

import "../Form/Form.sass";

/**
 * 
 * JoaoAdegas
 * 
 * 1234
 */

const schema = z.object({
    username: z.string().min(3, "O nome deve ter pelo menos três caracteres"),
    password: z.string().min(3, "A senha deve ter pelo menos seis caracteres"),
});

export default function Form() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("nome");
    }, []);
    
 
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const handleLogin = async (data) => {
        try {
            const response = await axios.post("http://localhost:8000/token/", data);
            withCredentials: true;
            if (response.data.access) {
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("user_type", response.data.usuario.tipo);
                localStorage.setItem("nome", response.data.usuario.nome);

                console.log("Username:", response.data.usuario.username);
                console.log("Tipo Usuario:", response.data.usuario.tipo);
                console.log("Nome:", response.data.usuario.nome);
                console.log("Token recebido:", response.data.access);

                navigate("/Home");
            } else {
                alert("Credenciais inválidas");
            }
        } catch (error) {
            alert("Erro ao fazer login");
        }
    };

    return (
        <div className="Container-Login">
            <div className="containerBackground">
                <div>
                    <img src="/Login.svg" alt="Login" className="img" />
                </div>

                <div className="container-form">
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit(handleLogin)} className="form">
                        <input
                            type="text"
                            placeholder="Username"
                            className="input"
                            {...register("username")}
                        />
                        {errors.username && <p className="error">{errors.username.message}</p>}

                        <input
                            type="password"
                            placeholder="Password"
                            className="input"
                            {...register("password")}
                        />
                        {errors.password && <p className="error">{errors.password.message}</p>}

                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
