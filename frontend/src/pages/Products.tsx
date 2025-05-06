import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  discount?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Bandoma gauti produktus...');
        const response = await axios.get<Product[]>('/api/products');
        console.log('Gauti produktai:', response.data);
        setProducts(response.data);
      } catch (err) {
        console.error('Klaida gaunant produktus:', err);
        setError('Nepavyko užkrauti produktų');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(product => product.category))];
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  if (loading) return <div className="container text-center">Kraunama...</div>;
  if (error) return <div className="container d-flex justify-content-center"><div className="alert alert-danger w-50 text-center">{error}</div></div>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Produktai</h1>
      
      <div className="mb-4">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Visos kategorijos</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col">
            <div className="card h-100">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  {product.discount ? (
                    <div>
                      <span className="text-decoration-line-through text-muted me-2">{product.price}€</span>
                      <span className="text-danger fw-bold">
                        {(product.price * (1 - product.discount / 100)).toFixed(2)}€
                      </span>
                      <span className="badge bg-danger ms-2">-{product.discount}%</span>
                    </div>
                  ) : (
                  <strong>Kaina: {product.price}€</strong>
                  )}
                </p>
                <div className="d-flex justify-content-between">
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-outline-primary"
                  >
                    Peržiūrėti
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Į krepšelį
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

export default Products; 