import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from '../api/axios';
import styles from '../styles/Profile.module.css';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>('/api/users/me');
        setUserData(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (err) {
        setError('Nepavyko užkrauti vartotojo duomenų');
        console.error('Klaida gaunant vartotojo duomenis:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      await axios.patch('/api/users/me', formData);
      setUserData(prev => prev ? { ...prev, ...formData } : null);
      setSuccess('Profilis sėkmingai atnaujintas');
      setIsEditing(false);
    } catch (err) {
      setError('Nepavyko atnaujinti profilio');
      console.error('Klaida atnaujinant profilį:', err);
    }
  };

  if (!userData) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div>Kraunama...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h2 className="mb-0">Profilis</h2>
          </div>
          <div className={styles.cardBody}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Vardas</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">El. paštas</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className="btn btn-primary">
                    Išsaugoti
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: userData.name,
                        email: userData.email,
                      });
                    }}
                  >
                    Atšaukti
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.userInfo}>
                  <h5>Vardas</h5>
                  <p>{userData.name}</p>
                </div>
                <div className={styles.userInfo}>
                  <h5>El. paštas</h5>
                  <p>{userData.email}</p>
                </div>
                <div className={styles.userInfo}>
                  <h5>Rolė</h5>
                  <p>{userData.role}</p>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Redaguoti profilį
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 