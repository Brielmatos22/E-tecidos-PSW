import { useState } from "react";
import {isValidEmail, isValidPassword} from "../../constants/verify";
import "./Loginstyle.css";

export default function Login(tipo, id, value) {
    const [isLoginMode, setLoginMode] = useState(true);
    const [isVisiblePassword, setVisiblePassword] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")

    const VisiblePassWord = () => {
        setVisiblePassword(!isVisiblePassword);
    };

    const handleSublimit =(evento)=>{
        evento.preventDefault();

        if(!isValidEmail(email)){
            alert("E-mail invalido");
            return;
        }

        if(!isValidPassword(password)){
            alert(" Senha invalida");
            return;
        }

        console.log("E-mail", email);
        console.log("Senha", password);
    };

    return (
        <div className="login-container">
            {/*title Header*/}
            <div className="login-header">
                <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
            </div>

            {/*Table Control*/}
            <div className="login-tabs">
                <button type="button">Login</button>
                <button type="button">Sign Up</button>

                <button className="login-tab" type="button" onClick={() => setLoginMode(true)}>
                    Login
                </button>

                <button className="login-tab" type="button" onClick={() => setLoginMode()}>
                    Sign Up
                </button>
                <div className="login-tab-spacer"></div>
            </div>

            <form className="formulario-login">
                {!isLoginMode && (
                    <input className="campo-login" type="text" placeholder="Name" required />
                )}

                <input className="campo-login" type="email" placeholder="E-mail" required />
                <input className="campo-login" type={tipo === "password" && isVisiblePassword ? "text" : tipo} placeholder="Password" required
                    id={id}
                    value={value}
                    onChange={(evento) => setPassword(evento.target.value)}/>

                {tipo === 'Password' && (
                    <button type="button"
                        className="toggle=Password"
                        onClick={VisiblePassWord}>
                           {isVisiblePassword ? 'Esconder' : 'Mostrar'}
                    </button>
                )}

                {!isLoginMode && (
                    <input className="campo-login" type="Confirm Password" placeholder="Confirm Password" required />
                )}

                {!isLoginMode && (
                    <div className="rotulo-senha">
                        Forget password
                    </div>
                )}

                <button className="botao-login" type="submit">
                    {isLoginMode ? "Login" : "Sign Up"}
                </button>

                <p className="link-cadastro">{isLoginMode ? "Don't hve account?" : "Already have account"}
                    <button className="link-cadastro-botao" type="button" onClick={() => setLoginMode(!isLoginMode)}>{isLoginMode ? "Sign Up Now" : "Login"}</button>
                </p>
            </form>
        </div>
    );
}