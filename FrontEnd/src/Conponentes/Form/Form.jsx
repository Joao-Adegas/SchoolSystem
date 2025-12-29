import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import "../Form/Form.sass";

const schema = z.object({
    username: z.string().min(3, "O nome deve ter pelo menos três caracteres"),
    password: z.string().min(3, "A senha deve ter pelo menos seis caracteres"),
});

export default function Form() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/token/", data, { withCredentials: true });

            if (response.data.access) {
                localStorage.setItem("token", response.data.access);
                localStorage.setItem("user_type", response.data.usuario.tipo);
                localStorage.setItem("nome", response.data.usuario.nome);
                localStorage.setItem("ni", response.data.usuario.NI);
                
                navigate("/professores");
            } else {
                alert("Credenciais inválidas");
            }
        } catch (error) {
            alert("Erro ao fazer login");
        } finally {
            setLoading(false); 
        }

    };

    return (
        <div className="container-login">

            <div className="background-login">

                <div className="wellcome-msg">
                    <h1>Sistema de Gestão Educacional</h1>
                    <p>Gerencie professores, disciplinas e reservas de ambientes de forma eficiente e organizada.</p>
                </div>

                <img src="/images/login_background.jpg" alt="img" />
            </div>

            <div className="containerBackground">

                <div className="container-form">

                    <div className="image">
                        <GraduationCap size={70} color="white" className="icone-lucide" />
                    </div>

                    <div className="mensagens-wellcome">
                        <p className="titulo">Bem-Vindo de volta</p>
                        <p className="subtitulo">Entre com suas credenciais para acessar o sistema</p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="form">

                        <div className="input-username input-container">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="João Silva"
                                className="input"
                                {...register("username")}
                            />
                            {errors.username && <p className="error">{errors.username.message}</p>}
                        </div>

                        <div className="input-password input-container">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="*************"
                                className="input"
                                {...register("password")}
                            />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>

                        <button type="submit" disabled={loading}>{loading ? "Carregando..." : "Entrar"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
