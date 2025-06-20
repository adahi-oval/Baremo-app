import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Users from './pages/Users';
import { Layout } from './components/Layout';
import { Merits } from './pages/Merits';
import MeritDetail from './pages/MeritDetail';
import LoginPage from './pages/Login';
import EditMerit from './pages/EditMerit';
import DeleteMerit from './pages/DeleteMerit';
import AddMerit from './pages/AddMerit';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />

        <Route path="/merits" element={<Merits />} />
        <Route path='/merits/add' element={<AddMerit />} />
        
        <Route path='/merit/:id' element={<MeritDetail />} />
        <Route path='/merit/:id/edit' element={<EditMerit />} />
        <Route path='/merit/:id/delete' element={<DeleteMerit />} />

        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
