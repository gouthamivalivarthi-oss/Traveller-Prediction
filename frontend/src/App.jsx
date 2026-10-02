import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import TravelAIButton from './components/chatbot/TravelAIButton';
import TravelAIChat from './components/chatbot/TravelAIChat';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChatbotPage from './pages/ChatbotPage';
import PredictionPage from './pages/PredictionPage';
import HolidaysPage from './pages/HolidaysPage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MyTripsPage from './pages/MyTripsPage';
import SavedTripsPage from './pages/SavedTripsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = location.pathname === '/' || location.pathname === '/login';

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8ED] warm-hero-mesh text-[#34261F] flex relative overflow-x-hidden">
      {/* Sidebar for Dashboard & App Modules */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/holidays" element={<HolidaysPage />} />
            <Route path="/routes" element={<RoutePlannerPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route path="/saved" element={<SavedTripsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global 3D Floating Travel AI Assistant */}
      <TravelAIButton onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} />
      <TravelAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

