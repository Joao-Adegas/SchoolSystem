import "../Rodape/Rodape.sass"

export function Rodape(){
    return(
    
        <footer>

            <div className="ContainerFooter">
               <div className="container-imagte-footer">
                    <figure>
                        <img src="../public/favicon.svg" alt="" srcSet="" className="image-footer"/>
                    </figure>
               </div>
               <div className="mensagens-missão footer-description">
                <h1 className="subtitulo">Objetivo: </h1>
                    <ul>
                        <li>📚 Educação é o caminho para um futuro melhor.</li>
                        <li>✨ Transformando conhecimento em oportunidades!</li>
                        <li>🏫 Nossa missão é formar cidadãos preparados para o mundo.</li>
                    </ul>
               </div>

               <div className="mensagens-ctt footer-description" >
                    <h1 className="subtitulo">Disponibilidade:</h1>
                    <ul>
                        <li>🕒 Horário de atendimento: Segunda a Sexta, das 8h às 18h.</li>
                        <li>📞 Precisa de ajuda? Entre em contato pelo telefone 190</li>
                        <li>📍 Endereço: Rua da Educação, 123 – Cidade do Conhecimento</li>
                    </ul>
               </div>


            </div>

            <div className="DireitosAutorais">
                <p>Todos os Direitos Reservados</p>
            </div>

        </footer>
     
    )
}