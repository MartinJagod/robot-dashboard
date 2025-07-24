import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar el userId (podés usar localStorage, contexto, etc.)
        localStorage.setItem('userId', data.userId);
        navigate('/heatmap/1');
      } else {
        setError(data.error || 'Login incorrecto');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
        <img src="/Logos/aviRobotsLogo.png" alt="Avia Robots Logo" />
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
