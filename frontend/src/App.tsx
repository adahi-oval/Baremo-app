import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Layout } from './components/Layout';
import { Merits } from './pages/Merits';
import MeritDetail from './pages/MeritDetail';
import LoginPage from './pages/Login';
import EditMerit from './pages/EditMerit';
import DeleteMerit from './pages/DeleteMerit';
import AddMerit from './pages/AddMerit';
import Unauthorized from './pages/Unauthorized';
import AdminUsersPage from './pages/AdminUsers';
import UserPage from './pages/UserPage';
import AddUser from './pages/AddUser';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/user/:researcherId" element={<UserPage />} />
        <Route path="/user/add" element={<ProtectedRoute allowedRoles={["admin"]}><AddUser /></ProtectedRoute>} />

        <Route path="/merits" element={<ProtectedRoute allowedRoles={["admin"]}><Merits /></ProtectedRoute>} />
        <Route path='/merits/add' element={<ProtectedRoute><AddMerit /></ProtectedRoute>} />
        
        <Route path='/merit/:id' element={<MeritDetail />} />
        <Route path='/merit/:id/edit' element={<EditMerit />} />
        <Route path='/merit/:id/delete' element={<DeleteMerit />} />

        <Route path='/login' element={<LoginPage />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
