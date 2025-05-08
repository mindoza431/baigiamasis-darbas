import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useCart } from '../contexts/CartContext';
import ProductReviews from '../components/ProductDetails';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  discount?: number;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Nepavyko užkrauti produkto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center">Kraunama...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-warning">Produktas nerastas</div>;

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            className="img-fluid rounded"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          {product.discount ? (
            <div className="mb-3">
              <span className="text-decoration-line-through text-muted me-2 fs-4">{product.price}€</span>
              <span className="text-danger fw-bold fs-4">
                {(product.price * (1 - product.discount / 100)).toFixed(2)}€
              </span>
              <span className="badge bg-danger ms-2 fs-6">-{product.discount}%</span>
            </div>
          ) : (
          <p className="lead">{product.price}€</p>
          )}
          <p>{product.description}</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product)}
            >
              Į krepšelį
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/products')}
            >
              Grįžti į produktus
            </button>
          </div>
        </div>
      </div>

      {/* Atsiliepimų sekcija */}
      <div className="mt-5">
        <ProductReviews />
      </div>
    </div>
  );
};

export default ProductDetails; 