import { GraduationCap, Calendar, BookOpen, Users, LogOut, School } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../Aside/Aside.sass"

export default function Aside() {

    const nome = localStorage.getItem("nome");
    const userType = localStorage.getItem("user_type");
    const senha = localStorage.getItem("senha");
    console.log(`Senha de ${nome}: ${senha}`);
    console.log("Pessoa Logada: ", nome, userType);

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
                    <NavLink to="/ambientes" className="rota">
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

                    <NavLink to="/professores" className="rota">
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

                    <NavLink to="/disciplinas" className="rota">
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
                        <NavLink to="/diretor" className="rota">
                            <School /> <span>Funcionarios</span>
                        </NavLink>

                    )}

                </div>
            </div>


            <NavLink to="/" className="rotaLogout">
                <LogOut /> <span>Sair</span>
            </NavLink>
        </aside>
    );

}