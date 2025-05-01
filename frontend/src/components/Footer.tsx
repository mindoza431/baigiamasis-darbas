import React from 'react';
import styles from '../styles/Footer.module.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaGoogle } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Kontaktai</h3>
          <div className={styles.contactInfo}>
            <FaMapMarkerAlt />
            <span>Gedimino g. 1, Vilnius, Lietuva</span>
          </div>
          <div className={styles.contactInfo}>
            <FaPhone />
            <span>+370 600 00000</span>
          </div>
          <div className={styles.contactInfo}>
            <FaEnvelope />
            <span>info@elektronikosshop.lt</span>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Socialiniai tinklai</h3>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram />
            </a>
            <a href="mailto:info@elektronikosshop.lt" className={styles.socialLink}>
              <FaGoogle />
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Mus rasite čia</h3>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.219426156724!2d25.2796143158908!3d54.6873779802876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd9400f2b5b3f3%3A0x52ef8b5f3a0d7c5a!2sGedimino%20pr.%2C%20Vilnius!5e0!3m2!1slt!2slt!4v1645000000000!5m2!1slt!2slt"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Elektronikos Shop. Visos teisės saugomos.</p>
      </div>
    </footer>
  );
};

export default Footer; 