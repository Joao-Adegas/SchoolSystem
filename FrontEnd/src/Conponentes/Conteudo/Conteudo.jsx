import "../Conteudo/Conteudo.sass"
import Card from "../Card/Card"
import { Link } from 'react-router-dom'

const cardGestor = [
    {img:"../src/assets/DisciplinaImage.png",nome:'Disciplínas',link:"/disciplinas"},

    {img:"../src/assets/AmbienteIcon.png",nome:'Ambientes',link:"/ambientes"},

    {img:"../src/assets/DiretorImage.png",nome:'Funcionários',link:"/diretor"},

    {img:"../src/assets/SalaImage.png",nome:'Salas',link:"/salas"},
]

const cardProfessor = [

    {img:"../src/assets/DisciplinaImage.png",nome:'Disciplinas',link:"/disciplinas"},

    {img:"../src/assets/AmbienteIcon.png",nome:'Ambientes',link:"/ambientes"},
  
]


export function Conteudo(){
    const userType = localStorage.getItem("user_type");

    return(
       
        <div className="Cards">
            {(userType === "Gestor" ? cardGestor : cardProfessor).map((item, index) => (
                <Link to={item.link} key={index}>
                    <div className="divCard">
                        <Card img={item.img} className="ImagemCard" />
                        <p className="link"> {item.nome} </p>
                    </div>
                </Link>
            ))}
        </div>

    
    )

}