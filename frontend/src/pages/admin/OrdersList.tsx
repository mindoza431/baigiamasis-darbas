import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import styles from '../../styles/admin/OrdersList.module.css';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nepavyko užkrauti užsakymų');
      console.error('Klaida gaunant užsakymus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nepavyko atnaujinti užsakymo statuso');
      console.error('Klaida atnaujinant užsakymo statusą:', err);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm('Ar tikrai norite ištrinti šį užsakymą?')) {
      return;
    }

    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Nepavyko ištrinti užsakymo');
      console.error('Klaida trinant užsakymą:', err);
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'Laukiama',
      processing: 'Apdorojama',
      completed: 'Užbaigta',
      cancelled: 'Atšaukta'
    };
    return statusMap[status];
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Kraunama...</span>
      </div>
    </div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.title}>Užsakymai</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={`card h-100`}>
              <div className={`card-header ${styles.cardHeader}`}>
                <h5 className={styles.orderTitle}>Užsakymas #{order._id.slice(-6)}</h5>
                <span className={`badge ${styles.statusBadge} ${styles[order.status]}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="card-body">
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
                        <div className={styles.itemInfo}>
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className={styles.itemImage}
                          />
                          <div className={styles.itemDetails}>
                            <span className={styles.itemName}>{item.product.name}</span>
                            <span className={styles.itemQuantity}>{item.quantity} vnt.</span>
                          </div>
                        </div>
                        <span className={styles.itemPrice}>{item.price.toFixed(2)}€</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Bendra suma</h6>
                  <p className={styles.total}>
                    <strong>{order.total.toFixed(2)}€</strong>
                  </p>
                </div>

                <div className={styles.section}>
                  <h6 className={styles.sectionTitle}>Data</h6>
                  <p className={styles.date}>
                    {new Date(order.createdAt).toLocaleString('lt-LT')}
                  </p>
                </div>
              </div>
              <div className={`card-footer bg-transparent ${styles.cardFooter}`}>
                <div className={styles.actions}>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                  >
                    <option value="pending">Laukiama</option>
                    <option value="processing">Apdorojama</option>
                    <option value="completed">Užbaigta</option>
                    <option value="cancelled">Atšaukta</option>
                  </select>
                  <button
                    className={`btn btn-outline-danger ${styles.deleteButton}`}
                    onClick={() => handleDelete(order._id)}
                  >
                    <i className="bi bi-trash"></i>
                    Ištrinti
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