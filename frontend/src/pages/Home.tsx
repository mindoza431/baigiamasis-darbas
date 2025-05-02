import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';
import { FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Nepavyko gauti prekių');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Įvyko klaida');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Kraunama...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Gerokai pigiau nei kitur</h1>
          <p>Geriausi pasiūlymai Jums!</p>
          <Link to="/products" className={styles.ctaButton}>
            Atraskite mūsų pasiūlymus
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <FaTruck className={styles.featureIcon} />
          <h3>Greitas pristatymas</h3>
          <p>Pristatome per 1-2 darbo dienas visoje Lietuvoje</p>
        </div>
        <div className={styles.featureCard}>
          <FaShieldAlt className={styles.featureIcon} />
          <h3>Garantija kokybei</h3>
          <p>Visos prekės yra patikrintos ir garantuotos</p>
        </div>
        <div className={styles.featureCard}>
          <FaHeadset className={styles.featureIcon} />
          <h3>Klientų aptarnavimas</h3>
          <p>Profesionalus klientų aptarnavimas 24/7</p>
        </div>
      </section>

      <section className={styles.productsPreview}>
        <h2>Populiariausios prekės</h2>
        <div className={styles.productsGrid}>
          {products.slice(0, 3).map((product) => (
            <div key={product._id} className={styles.productCard}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className={styles.productPrice}>{product.price} €</div>
                <Link to={`/products/${product._id}`} className={styles.viewButton}>
                  Peržiūrėti
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 