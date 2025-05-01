import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import ProductsList from './admin/ProductsList';
import OrdersList from './admin/OrdersList';
import styles from '../styles/admin/Admin.module.css';

const Admin = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <div className="row">
        <div className="d-md-none mb-3">
          <button
            className={`btn btn-primary ${styles.sidebarToggle}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? 'Slėpti meniu' : 'Rodyti meniu'}
          </button>
        </div>

        <div className={`col-md-3 col-lg-2 ${isSidebarOpen ? 'd-block' : 'd-none d-md-block'}`}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarList}>
              <Link
                to="/admin/products"
                className={`${styles.sidebarItem} ${
                  activeTab.includes('/admin/products') ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab('/admin/products');
                  setIsSidebarOpen(false);
                }}
              >
                <i className={`bi bi-box ${styles.sidebarIcon}`}></i>
                Prekės
              </Link>
              <Link
                to="/admin/add-product"
                className={`${styles.sidebarItem} ${
                  activeTab === '/admin/add-product' ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab('/admin/add-product');
                  setIsSidebarOpen(false);
                }}
              >
                <i className={`bi bi-plus-circle ${styles.sidebarIcon}`}></i>
                Pridėti prekę
              </Link>
              <Link
                to="/admin/orders"
                className={`${styles.sidebarItem} ${
                  activeTab === '/admin/orders' ? styles.active : ''
                }`}
                onClick={() => {
                  setActiveTab('/admin/orders');
                  setIsSidebarOpen(false);
                }}
              >
                <i className={`bi bi-cart-check ${styles.sidebarIcon}`}></i>
                Užsakymai
              </Link>
            </div>
          </div>
        </div>

        <div className={`col-md-9 col-lg-10 ${styles.mainContent}`}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/products" replace />} />
                <Route path="products" element={<ProductsList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="orders" element={<OrdersList />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin; 