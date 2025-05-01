import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import styles from '../styles/Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Neteisingi prisijungimo duomenys');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2>Prisijungti</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">El. paštas</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Slaptažodis</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.loginButton}>
            Prisijungti
          </button>
        </form>
        <div className={styles.registerLink}>
          Neturite paskyros? <Link to="/register">Registruotis</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 