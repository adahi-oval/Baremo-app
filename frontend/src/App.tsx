import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Users from './pages/Users';
import { Layout } from './components/Layout';
import { Merits } from './pages/Merits';
import MeritDetail from './pages/MeritDetail';
import LoginPage from './pages/Login';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/merits" element={<Merits />} />
        <Route path='/merit/:id' element={<MeritDetail />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
