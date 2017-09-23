import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';

import Nav from '../Nav/Nav.jsx';
import Footer from '../Footer/Footer.jsx';
import styles from './Router.css';

// Front
import FrontRoute from '../../../shared/components/FrontRoute/FrontRoute.jsx';

// Vocab
import DecksRoute from '../../../vocab/components/DecksRoute/DecksRoute.jsx';
import WordsRoute from '../../../vocab/components/WordsRoute/WordsRoute.jsx';
import KindleUpload from '../../../vocab/components/KindleUpload/KindleUpload.jsx';

const Routes = () => (
  <Router>
    <div>
      <Nav />

      <Route exact path="/" component={ FrontRoute } />

      <Route exact path="/vocab" component={ DecksRoute } />
      <Route path="/vocab/:id" component={ WordsRoute } />
      <Route path="/kindle" component={ KindleUpload } />
      <Route path="/books" component={ () => <Redirect to="/vocab" /> } />

      <Footer />
    </div>
  </Router>
);

export default Routes;
