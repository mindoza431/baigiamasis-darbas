import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from '../api/axios';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Prašome prisijungti prieš pateikiant užsakymą');
    }
  }, []);

  const handleSubmitOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      setIsSubmitting(true);
      setError('');

      const orderData = {
        items: items.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total
      };

      const response = await axios.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Užsakymo atsakymas:', response.data);
      clearCart();
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);

    } catch (err: any) {
      console.error('Klaida pateikiant užsakymą:', err);

      if (err.response) {
        console.error('Atsakymo klaida:', err.response.data);
        setError(err.response.data.message || 'Nepavyko pateikti užsakymo.');
      } else {
        setError('Nepavyko pateikti užsakymo. Bandykite dar kartą.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className={`container ${styles.emptyCart}`}>
        <h2>Jūsų krepšelis tuščias</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/products')}
        >
          Peržiūrėti produktus
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Jūsų krepšelis</h2>
      
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '4px',
          zIndex: 9999,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.5s ease-out',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          ✅ Užsakymas pateiktas sėkmingai
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>Prekė</th>
              <th>Kaina</th>
              <th>Kiekis</th>
              <th>Suma</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      className="me-2"
                    />
                    <div>
                      <h6 className="mb-0">{item.name}</h6>
                      <small className="text-muted">{item.description}</small>
                    </div>
                  </div>
                </td>
                <td>
                  {item.discount ? (
                    <div>
                      <span className="text-decoration-line-through text-muted me-2">{item.price}€</span>
                      <span className="text-danger fw-bold">
                        {(item.price * (1 - item.discount / 100)).toFixed(2)}€
                      </span>
                      <span className="badge bg-danger ms-2">-{item.discount}%</span>
                    </div>
                  ) : (
                    <span>{item.price}€</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="form-control"
                    style={{ width: '70px' }}
                  />
                </td>
                <td>
                  {item.discount ? (
                    <span className="text-danger fw-bold">
                      {((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}€
                    </span>
                  ) : (
                    <span>{(item.price * item.quantity).toFixed(2)}€</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Pašalinti
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`${styles.totalSection} d-flex justify-content-between align-items-center`}>
        <h4>Bendra suma: {total.toFixed(2)}€</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            Išvalyti krepšelį
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Pateikiama...' : 'Pateikti užsakymą'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 