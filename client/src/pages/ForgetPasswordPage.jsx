import ForgetPasswordForm from "../components/ForgetPasswordForm";

const ForgetPassword = ({ onForgetPasssword }) => {
  return (
    <div className="ForgetPassword">
      <header>
        <h1>Welcome to Incident Management App</h1>
        <p>Change your password.</p>
      </header>
      <div className="forms">
        <ForgetPasswordForm onForgetPasssword={onForgetPasssword} />
      </div>
    </div>
  );
};

export default ForgetPassword;