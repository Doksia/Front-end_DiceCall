import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { CharacterCreator } from './pages/CharacterCreator';
import { CampaignCreator } from './pages/CampaignCreator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-character" element={<CharacterCreator />} />
          <Route path="/create-campaign" element={<CampaignCreator />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
