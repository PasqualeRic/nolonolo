import './styles/footer.css'
import logo from './N+.png'
function footer(){
    return(
        <footer class="footer-copyright text-center py-3" id="footer">
            <div class="infobox">
                <div class="left">
                    <span>link utili</span>
                    <ul>
                        <li>
                            <a href="/backoff">Funzionario</a>
                        </li>
                        <li>
                            <a href="/manager">Manager</a>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <img src={logo} alt="logo"></img><br></br>
                    <span>NoloNolo+</span>
                </div>
            </div>
            <div class="closing">
                <span>Copyright © Tecnologie Web: NoloNolo+ 2021</span>
            </div>
        </footer>
    )}

export default footer;