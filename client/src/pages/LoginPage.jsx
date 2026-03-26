import LoginForm from '../components/LoginForm.jsx';
import "./LoginPage.css";

const Login = ({ onLogin }) => {
  return (
    <div className="login">
      <header>
        <h1>Welcome to Incident Management App</h1>
        <p>Manage incidents efficiently and securely.</p>
      </header>
      <div className="forms">
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
};

export default Login;