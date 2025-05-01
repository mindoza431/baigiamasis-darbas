import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import styles from '../../styles/admin/ProductForm.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get<Product>(`/api/products/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Nepavyko užkrauti prekės');
      console.error('Klaida gaunant prekę:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setIsSubmitting(true);
      setError('');

      await axios.patch(`/api/products/${id}`, formData);
      navigate('/admin/products');
    } catch (err) {
      setError('Nepavyko atnaujinti prekės');
      console.error('Klaida atnaujinant prekę:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return <div className="text-center">Kraunama...</div>;
  }

  return (
    <div className={styles.formContainer}>
      <div className="card">
        <div className="card-header">
          <h2 className={styles.formTitle}>Redaguoti prekę</h2>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Pavadinimas</label>
              <input
                type="text"
                className={`form-control ${styles.input}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Aprašymas</label>
              <textarea
                className={`form-control ${styles.textarea}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>Kaina</label>
              <div className={styles.priceInput}>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${styles.input}`}
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text">€</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>Nuotraukos URL</label>
              <input
                type="url"
                className={`form-control ${styles.input}`}
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
              {formData.image && (
                <div className={styles.imagePreview}>
                  <img
                    src={formData.image}
                    alt={formData.name}
                    className="img-fluid rounded"
                  />
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={`btn btn-primary ${styles.submitButton}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={`spinner-border spinner-border-sm ${styles.loadingSpinner}`} role="status" aria-hidden="true"></span>
                    Atnaujinama...
                  </>
                ) : (
                  <>
                    <i className={`bi bi-check-circle ${styles.submitButtonIcon}`}></i>
                    Išsaugoti
                  </>
                )}
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${styles.cancelButton}`}
                onClick={() => navigate('/admin/products')}
              >
                <i className={`bi bi-x-circle ${styles.cancelButtonIcon}`}></i>
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 