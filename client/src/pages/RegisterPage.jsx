import RegisterForm from "../components/RegisterForm";

const Register = ({ onRegister }) => {
  return (
    <div className="register">
      <header>
        <h1>Welcome to Incident Management App</h1>
        <p>Manage incidents efficiently and securely.</p>
      </header>
      <div className="forms">
        <RegisterForm onRegister={onRegister} />
      </div>
    </div>
  );
};

export default Register;