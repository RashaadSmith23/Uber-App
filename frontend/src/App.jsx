import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import RiderHome from './pages/RiderHome';
import DriverHome from './pages/DriverHome';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { RideProvider } from './contexts/RideContext';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <RideProvider>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rider/*" element={<RiderHome />} />
              <Route path="/driver/*" element={<DriverHome />} />
            </Routes>
          </RideProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}