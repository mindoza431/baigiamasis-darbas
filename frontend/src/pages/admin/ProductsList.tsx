import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from '../../styles/admin/ProductsList.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>('/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Nepavyko užkrauti prekių');
      console.error('Klaida gaunant prekes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ar tikrai norite ištrinti šią prekę?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError('Nepavyko ištrinti prekės');
      console.error('Klaida trinant prekę:', err);
    }
  };

  if (loading) {
    return <div className="text-center">Kraunama...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Prekės</h2>
        <Link to="/admin/add-product" className={`btn btn-primary ${styles.addButton}`}>
          <i className={`bi bi-plus-circle ${styles.addButtonIcon}`}></i>
          Pridėti prekę
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product.id} className="col">
            <div className={`card h-100 ${styles.productCard}`}>
              <img
                src={product.image}
                className={`card-img-top ${styles.productImage}`}
                alt={product.name}
              />
              <div className={`card-body ${styles.productBody}`}>
                <h5 className={`card-title ${styles.productTitle}`}>{product.name}</h5>
                <p className={`card-text text-muted ${styles.productDescription}`}>
                  {product.description}
                </p>
                <p className={`card-text ${styles.productPrice}`}>
                  <strong>Kaina: {product.price}€</strong>
                </p>
              </div>
              <div className={`card-footer bg-transparent ${styles.cardFooter}`}>
                <div className={`d-flex gap-2 ${styles.actions}`}>
                  <button
                    className={`btn btn-primary btn-sm flex-grow-1 ${styles.editButton}`}
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                  >
                    <i className={`bi bi-pencil ${styles.editButtonIcon}`}></i>
                    Redaguoti
                  </button>
                  <button
                    className={`btn btn-danger btn-sm ${styles.deleteButton}`}
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="bi bi-trash"></i>
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

export default ProductsList; 