import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * FeatureGrid Component - Display features in a responsive grid
 * 
 * @param {number} columns - Number of columns (2, 3, 4)
 * @param {ReactNode} children - FeatureGridItem components
 */
export default function FeatureGrid({ columns = 3, children }) {
  return (
    <div 
      className={styles.featureGrid}
      style={{ '--grid-columns': columns }}
    >
      {children}
    </div>
  );
}

/**
 * FeatureGridItem - Individual feature card
 *
 * @param {ReactNode} icon - Optional icon
 * @param {string} title - Feature title
 * @param {ReactNode} label - Optional small label (e.g. status chip) shown under the title
 * @param {string} description - Feature description
 * @param {string} href - Optional link
 */
export function FeatureGridItem({ icon, title, label, description, href, children }) {
  const Content = () => (
    <>
      {icon && (
        <div className={styles.featureIcon}>
          {icon}
        </div>
      )}
      <div className={styles.featureHead}>
        <h3 className={styles.featureTitle}>{title}</h3>
        {label != null && label !== '' && (
          <span className={styles.featureLabel}>{label}</span>
        )}
      </div>
      {description && (
        <p className={styles.featureDescription}>{description}</p>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={styles.featureItem}>
        <Content />
      </a>
    );
  }

  return (
    <div className={styles.featureItem}>
      <Content />
    </div>
  );
}

