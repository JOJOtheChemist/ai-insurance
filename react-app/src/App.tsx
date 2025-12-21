import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage/LoginPage';
import CustomerList16 from './components/CustomerList16';
import MobileChatLayout from './components/MobileChatLayout';
import MobileChatInterface from './components/MobileChatInterface';
import AIRoleIntro from './components/AIRoleIntro';
import CRMErrorState from './components/CRMErrorState';
import CRMMain from './components/CRMMain';
import CustomerList15 from './components/CustomerList15';
import CustomerCard1 from './components/CustomerCard1';
import CustomerCard2 from './components/CustomerCard2';
import CRMFull from './components/CRMFull';
import QuickInfoGuide from './components/QuickInfoGuide';
import ScriptCardComparison from './components/ScriptCardComparison';
import ScriptCardSingle from './components/ScriptCardSingle';
import CRMCard from './components/CRMCard';
import OptimizedCustomerCard from './components/OptimizedCustomerCard';
import DualCard from './components/DualCard';
import PlanRecommendationCard from './components/PlanRecommendationCard';
import HistoryRecords from './components/HistoryRecords';
import CompositeCustomerProfile from './components/CompositeCustomerProfile';
import DigitalHumanProfile from './pages/DigitalHumanProfile';
import CustomerProfilePanelPage from './pages/CustomerProfilePanelPage';
import AIWorkspacePage from './pages/AIWorkspacePage';
import AIWorkspaceMobile from './pages/AIWorkspaceMobile';
import DigitalHumanChat from './components/DigitalHumanChat';
import DigitalHumanChatSwitch from './components/DigitalHumanChatSwitch';
import DigitalHumanChatScreenEfficiency from './components/DigitalHumanChatScreenEfficiency';
import DigitalHumanChatWithContext from './components/DigitalHumanChatWithContext';
import CompositeDigitalHumanChat from './components/CompositeDigitalHumanChat';
import ExpertListPage from './pages/ExpertListPage';
import CustomerProfilePage from './components/CustomerProfilePage';
import CompositeChatFullPage from './pages/CompositeChatFullPage';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><CompositeChatFullPage /></ProtectedRoute>} />

          {/* Mobile-like pages requested by user */}
          <Route path="/crm-error-state" element={<ProtectedRoute><CRMErrorState hideNav={true} /></ProtectedRoute>} />
          <Route path="/composite-chat-full" element={<ProtectedRoute><CompositeChatFullPage /></ProtectedRoute>} />
          <Route path="/digital-human-profile" element={<ProtectedRoute><DigitalHumanProfile /></ProtectedRoute>} />
          <Route path="/mobile-workspace" element={<ProtectedRoute><AIWorkspaceMobile /></ProtectedRoute>} />
          <Route path="/customer-profile-panel" element={<ProtectedRoute><CustomerProfilePanelPage /></ProtectedRoute>} />
          <Route path="/expert-list" element={<ProtectedRoute><ExpertListPage /></ProtectedRoute>} />

          {/* Other components available but hidden from main flow */}
          <Route path="/customer-list-16" element={<ProtectedRoute><CustomerList16 /></ProtectedRoute>} />
          <Route path="/mobile-chat-layout" element={<ProtectedRoute><MobileChatLayout /></ProtectedRoute>} />
          <Route path="/mobile-chat-interface" element={<ProtectedRoute><MobileChatInterface /></ProtectedRoute>} />
          <Route path="/ai-role-intro" element={<ProtectedRoute><AIRoleIntro /></ProtectedRoute>} />
          <Route path="/crm-main" element={<ProtectedRoute><CRMMain /></ProtectedRoute>} />
          <Route path="/customer-list-15" element={<ProtectedRoute><CustomerList15 /></ProtectedRoute>} />
          <Route path="/customer-card-1" element={<ProtectedRoute><CustomerCard1 /></ProtectedRoute>} />
          <Route path="/customer-card-2" element={<ProtectedRoute><CustomerCard2 /></ProtectedRoute>} />
          <Route path="/crm-full" element={<ProtectedRoute><CRMFull /></ProtectedRoute>} />
          <Route path="/quick-info-guide" element={<ProtectedRoute><QuickInfoGuide /></ProtectedRoute>} />
          <Route path="/script-card-comparison" element={<ProtectedRoute><ScriptCardComparison /></ProtectedRoute>} />
          <Route path="/script-card-single" element={<ProtectedRoute><ScriptCardSingle /></ProtectedRoute>} />
          <Route path="/crm-card" element={<ProtectedRoute><CRMCard /></ProtectedRoute>} />
          <Route path="/optimized-customer-card" element={<ProtectedRoute><OptimizedCustomerCard /></ProtectedRoute>} />
          <Route path="/dual-card" element={<ProtectedRoute><DualCard /></ProtectedRoute>} />
          <Route path="/plan-recommendation-card" element={<ProtectedRoute><PlanRecommendationCard /></ProtectedRoute>} />
          <Route path="/history-records" element={<ProtectedRoute><HistoryRecords /></ProtectedRoute>} />
          <Route path="/composite-customer-profile" element={<ProtectedRoute><CompositeCustomerProfile /></ProtectedRoute>} />
          <Route path="/ai-workspace" element={<ProtectedRoute><AIWorkspacePage /></ProtectedRoute>} />
          <Route path="/digital-human-chat" element={<ProtectedRoute><DigitalHumanChat /></ProtectedRoute>} />
          <Route path="/digital-human-chat-switch" element={<ProtectedRoute><DigitalHumanChatSwitch /></ProtectedRoute>} />
          <Route path="/digital-human-chat-screen-efficiency" element={<ProtectedRoute><DigitalHumanChatScreenEfficiency /></ProtectedRoute>} />
          <Route path="/digital-human-chat-context" element={<ProtectedRoute><DigitalHumanChatWithContext /></ProtectedRoute>} />
          <Route path="/composite-chat" element={<ProtectedRoute><CompositeDigitalHumanChat /></ProtectedRoute>} />
          <Route path="/customer-profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
