import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute'; 
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { CharacterCreator } from './pages/CharacterCreator';
import { CampaignCreator } from './pages/CampaignCreator';
import { DashboardDM } from './pages/DashboardDM';
import { DashboardPlayer } from './pages/DashboardPlayer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> 

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create-character" element={<CharacterCreator />} />
            <Route path="/create-campaign" element={<CampaignCreator />} />
            <Route path="/dm-dashboard" element={<DashboardDM />} />
            <Route path="/player-dashboard" element={<DashboardPlayer />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;