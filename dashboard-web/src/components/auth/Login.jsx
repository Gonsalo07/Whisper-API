const Login = () => {
  return (
    <section className="form">
      <article className="group-title">
        <h3 className="title">Portal Denuncias Anonimas</h3>
        <h4 className="description">Porfavor ingresa los datos de tu cuenta</h4>
      </article>

      <p className="message">
        Hubo un error en los datos, porfavor revisalo....
      </p>

      <article className="group-input">
        <label>Usuario:</label>
        <div className="input-box">
          <div className="icon">
            <i class="fa-solid fa-user"></i>
          </div>
          <input type="text" placeholder="Ingresa tu nombre de usuario ..." />
        </div>
      </article>

      <article className="group-input">
        <label>Contraseña:</label>
        <div className="input-box">
          <div className="icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <input type="password" placeholder="Ingresa tu  contraseña ..." />
          <div className="showPass">
            <i class="fa-solid fa-eye"></i>
          </div>
        </div>
      </article>

      <button>
        <i class="fa-solid fa-arrow-right-to-bracket"></i>
        Iniciar Sesión
      </button>

      <p className="redirect_auth">
        No tienes una cuenta? <span>Registrate Aqui</span>
      </p>
    </section>
  );
};

export default Login;
