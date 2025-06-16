import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/Login/LoginForm';
import { getCurrentUser, loginUser } from '../api/auth';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setError('');
    try {
      await loginUser(email, password);

      const user = await getCurrentUser();
      setUser(user);

      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas, por favor inténtalo de nuevo.');
    }
  };

  return <LoginForm onLogin={handleLogin} error={error} />;
};

export default LoginPage;
