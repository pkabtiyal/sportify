import { Outlet } from 'react-router';
import Header from './Header';

import Footer from './Footer';

export default () => {
  return (
    <>
      <Header />
      <Outlet className="body" />
      <Footer />
    </>
  );
};