import { useState, useEffect } from 'react';
import axios from '../api/axios';
import styles from '../styles/Profile.module.css';

interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Laukiama',
      processing: 'Apdorojama',
      completed: 'Užbaigta',
      cancelled: 'Atšaukta'
    };
    return statusMap[status];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gauname vartotojo duomenis
        const userResponse = await axios.get<UserData>('/api/auth/me');
        setUserData(userResponse.data);
        setFormData({
          name: userResponse.data.name,
          email: userResponse.data.email,
        });

        // Gauname užsakymus
        const ordersResponse = await axios.get<Order[]>('/api/orders/my');
        console.log('Gauti užsakymai:', ordersResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        setError('Nepavyko užkrauti duomenų');
        console.error('Klaida gaunant duomenis:', err);
      }
    };

    fetchData();
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
      
      await axios.patch('/api/auth/me', formData);
      setUserData(prev => prev ? { ...prev, ...formData } : null);
      setSuccess('Profilis sėkmingai atnaujintas');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nepavyko atnaujinti profilio');
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
              <div>
                <div className={styles.userInfo}>
                  <p><strong>Vardas:</strong> {userData.name}</p>
                  <p><strong>El. paštas:</strong> {userData.email}</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Redaguoti profilį
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.ordersCard}>
          <div className={styles.cardHeader}>
            <h2 className="mb-0">Mano užsakymai</h2>
          </div>
          <div className={styles.cardBody}>
            {orders.length === 0 ? (
              <p>Jūs dar neturite užsakymų</p>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <div key={order._id} className={styles.orderItem}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <span className={styles.orderDate}>
                          Užsakymo data: {new Date(order.createdAt).toLocaleDateString('lt-LT')}
                        </span>
                        <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className={styles.orderTotal}>
                        Suma: {order.total.toFixed(2)}€
                      </div>
                    </div>
                    <div className={styles.orderProducts}>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.productItem}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <span className={styles.productName}>{item.product.name}</span>
                            <span className={styles.productQuantity}>{item.quantity} vnt.</span>
                            <span className={styles.productPrice}>{item.price.toFixed(2)}€</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 