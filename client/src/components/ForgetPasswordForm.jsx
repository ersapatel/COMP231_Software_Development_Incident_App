import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import API_BASE from '../apiBase';

const ForgetPasswordForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password and confirm password should match.");
            return;
        }

        try {
            const userIdByEmail = await fetch(`${API_BASE}/api/users/findUserIdByEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const { id } = await userIdByEmail.json();
            const updateUser = await fetch(`${API_BASE}/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })
            if (!updateUser.ok) {
                throw new Error(data.message || 'User update failed');
            }
            setSuccess('You have updated password successfully! Now login.');
            clearForm();
        } catch (err) {
            setError(err.message);
        }
  };
    
return (
    <form onSubmit={handleSubmit}  className="form" noValidate>
      <h2>ForgetPassword</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <button type="submit">Update Password</button>
      <button className="loginBtn" onClick={() => navigate('/login')}>Login</button>
    </form>
  );
}

export default ForgetPasswordForm;