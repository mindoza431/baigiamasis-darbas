import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import styles from '../../styles/admin/OrdersList.module.css';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const OrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get<Order[]>('/api/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Nepavyko užkrauti užsakymų');
      console.error('Klaida gaunant užsakymus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Nepavyko atnaujinti užsakymo statuso');
      console.error('Klaida atnaujinant užsakymo statusą:', err);
    }
  };

  if (loading) {
    return <div className="text-center">Kraunama...</div>;
  }

  return (
    <div>
      <h2 className={styles.title}>Užsakymai</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.id} className="col">
            <div className={`card h-100 ${styles.orderCard}`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className={styles.orderTitle}>Užsakymas #{order.id}</h5>
                <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className={`card-body ${styles.cardBody}`}>
                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Vartotojas</h6>
                  <p className={styles.userName}>
                    <strong>{order.user.name}</strong>
                  </p>
                  <p className={styles.userEmail}>{order.user.email}</p>
                </div>

                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Prekės</h6>
                  <ul className={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <li key={index} className={styles.item}>
                        <span>{item.quantity} vnt.</span>
                        <span>{item.price}€</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Bendra suma</h6>
                  <p className={styles.total}>
                    <strong>{order.total}€</strong>
                  </p>
                </div>

                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Data</h6>
                  <p className={styles.date}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`card-footer bg-transparent ${styles.cardFooter}`}>
                <div className={styles.actions}>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">Laukiama</option>
                    <option value="processing">Apdorojama</option>
                    <option value="completed">Užbaigta</option>
                    <option value="cancelled">Atšaukta</option>
                  </select>
                  <button
                    className={`btn btn-outline-primary ${styles.printButton}`}
                    onClick={() => window.print()}
                  >
                    <i className={`bi bi-printer ${styles.printButtonIcon}`}></i>
                    Spausdinti
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList; 