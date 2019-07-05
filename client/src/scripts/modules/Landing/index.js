import React from 'react';
import { Helmet } from 'react-helmet';

import styles from './styles.module.css';

const Landing = () => {
  return (
    <div className={styles.main}>
      <Helmet>
        <title>Capita - Centralize your financial life</title>
      </Helmet>

      <div>Landing</div>
    </div>
  );
};

export default Landing;