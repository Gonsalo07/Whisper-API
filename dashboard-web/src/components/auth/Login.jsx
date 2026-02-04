import { useState } from "react";
import { useForm } from "react-hook-form";

const Login = ({ setView }) => {
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="form" onSubmit={onSubmit}>
      <article className="group-title">
        <h3 className="title">Denuncias Anonimas | Login</h3>
        <h4 className="description">Porfavor ingresa los datos de tu cuenta</h4>
      </article>
      <article className="group-input">
        <label>Email:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-user"></i>
          </div>
          <input
            type="text"
            placeholder="Ingresa tu correo electronico ..."
            {...register("email", {
              required: {
                value: true,
                message: "Debes ingresar un correo electronico ...",
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/,
                message: "El correo electronico no es valido",
              },
            })}
          />
        </div>
        {errors.email && (
          <span className="message">{errors.email.message}</span>
        )}
      </article>
      <article className="group-input">
        <label>Contraseña:</label>
        <div className="input-box">
          <div className="icon">
            <i className="fa-solid fa-lock"></i>
          </div>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Ingresa tu  contraseña ..."
            {...register("password", {
              required: {
                value: true,
                message: "La contraseña es requerida",
              },
            })}
          />
          <div onClick={() => setShowPass(!showPass)} className="showPass">
            <i
              className={showPass ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
            ></i>
          </div>
        </div>
        {errors.password && (
          <span className="message">{errors.password.message}</span>
        )}
      </article>
      <button type="submit">
        <i className="fa-solid fa-arrow-right-to-bracket"></i>
        Iniciar Sesión
      </button>
      <p onClick={() => setView(1)} className="redirect_auth">
        No tienes una cuenta? <span>Registrate Aqui</span>
      </p>
    </form>
  );
};

export default Login;
