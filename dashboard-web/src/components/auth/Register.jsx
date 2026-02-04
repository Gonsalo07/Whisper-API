import { useState } from "react";
import { useForm } from "react-hook-form";

const Register = ({ setView }) => {
  return (
    <form className="form">
      <article className="group-title">
        <h3 className="title">Denuncias Anonimas | Registro</h3>
        <h4 className="description">
          Completa los campos requeridos para registrar tu cuenta
        </h4>
      </article>

      <article className="group-input">
        <label>DNI:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <input type="text" placeholder="Ingresa tu documento de identidad" />
        </div>
      </article>

      <article className="group-input">
        <label>Email:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <input type="text" placeholder="Ingresa un correo electronico" />
        </div>
      </article>

      <article className="group-input">
        <label>Contraseña:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <input type="password" placeholder="Ingresa tu contraseña" />
        </div>
      </article>

      <article className="group-input">
        <label>Contraseña:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <input
            type="password"
            placeholder="Vuelve a ingresar tu contraseña"
          />
        </div>
      </article>

      <article className="group-input-check">
        <input type="checkbox" name="" id="terminos" />
        <label htmlFor="terminos">
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </label>
      </article>

      <button type="submit">
        <i className="fa-solid fa-arrow-right-to-bracket"></i>
        Registrar Cuenta
      </button>
      <p onClick={() => setView(0)} className="redirect_auth">
        Ya tienes una cuenta? <span>Inicia Sesión Aqui</span>
      </p>
    </form>
  );
};

export default Register;
