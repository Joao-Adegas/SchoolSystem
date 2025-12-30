import { GraduationCap, Calendar, BookOpen, Users, LogOut, School } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Aside/Aside.sass"
import Swal from "sweetalert2";

export default function Aside() {
    const navigate = useNavigate();
    const nome = localStorage.getItem("nome");
    const userType = localStorage.getItem("user_type");
    const ni = localStorage.getItem("ni");


    function logout() {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você será desconectado do sistema.",
            icon: "none",

            showCancelButton: true,

            cancelButtonText: "Cancelar",
            confirmButtonText: "Sair",

            confirmButtonColor: "#000000",
            cancelButtonColor: "#e5e5e5",

            background: "#ffffffff",
            color: "#000000ff",

            iconColor: "#fbbf24",

            customClass: {
                popup: "swal-popup",
                title: "swal-title",
                htmlContainer: "swal-text",
                confirmButton: "swal-confirm",
                cancelButton: "swal-cancel",
            },

            buttonsStyling: false, 
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("nome");
                localStorage.removeItem("ni");
                localStorage.removeItem("user_type");
                navigate("/");
            }
        });
    }

    return (
        <aside className="aside">

            <div className="container">
                <div className="topAside">
                    <div className="icon">
                        <GraduationCap size={40} color="white" className="icon" />
                    </div>
                    <div className="right">
                        <h2>SGE</h2>
                        <p>Sistema de Gestão Escolar</p>
                    </div>
                </div>

                <div className="login-inf">
                    <p className="usename">{nome}</p>

                    <div className="gestor">
                        <p className="typeuser">{userType}</p>
                    </div>
                </div>

                <div className="rotas">
                    <NavLink to={`/ambientes/${ni + nome}`} className="rota">
                        {userType == "Professor" ? (
                            <>
                                <Calendar />  <span>Suas Reservas</span>
                            </>
                        ) : (
                            <>
                                <Calendar />  <span>Todas as Reservas</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to={`/professores/${ni + nome}`} className="rota">
                        {userType == "Professor" ? (
                            <>
                                <Users /> <span>Informações Pessoais</span>
                            </>
                        ) : (
                            <>
                                <Users /> <span>Professores</span>
                            </>

                        )}
                    </NavLink>

                    <NavLink to={`/disciplinas/${ni + nome}`} className="rota">
                        {userType == "Professor" ? (
                            <>
                                <BookOpen /> <span>Suas Disciplinas</span>
                            </>
                        ) : (
                            <>
                                <BookOpen /> <span>Todas as Disciplinas</span>
                            </>
                        )}
                    </NavLink>

                    {userType == "Gestor" && (
                        <NavLink to={`/diretor/${ni + nome}`} className="rota">
                            <School /> <span>Funcionarios</span>
                        </NavLink>

                    )}

                </div>
            </div>


            <NavLink className="rotaLogout" onClick={logout}>
                <LogOut /> <span >Sair</span>
            </NavLink>
        </aside>
    );

}