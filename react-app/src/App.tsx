
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CompositeChatFullPage />} />

        {/* Mobile-like pages requested by user */}
        <Route path="/crm-error-state" element={<CRMErrorState hideNav={true} />} />
        <Route path="/composite-chat-full" element={<CompositeChatFullPage />} />
        <Route path="/digital-human-profile" element={<DigitalHumanProfile />} />
        <Route path="/mobile-workspace" element={<AIWorkspaceMobile />} />
        <Route path="/customer-profile-panel" element={<CustomerProfilePanelPage />} />
        <Route path="/expert-list" element={<ExpertListPage />} />

        {/* Other components available but hidden from main flow */}
        <Route path="/customer-list-16" element={<CustomerList16 />} />
        <Route path="/mobile-chat-layout" element={<MobileChatLayout />} />
        <Route path="/mobile-chat-interface" element={<MobileChatInterface />} />
        <Route path="/ai-role-intro" element={<AIRoleIntro />} />
        <Route path="/crm-main" element={<CRMMain />} />
        <Route path="/customer-list-15" element={<CustomerList15 />} />
        <Route path="/customer-card-1" element={<CustomerCard1 />} />
        <Route path="/customer-card-2" element={<CustomerCard2 />} />
        <Route path="/crm-full" element={<CRMFull />} />
        <Route path="/quick-info-guide" element={<QuickInfoGuide />} />
        <Route path="/script-card-comparison" element={<ScriptCardComparison />} />
        <Route path="/script-card-single" element={<ScriptCardSingle />} />
        <Route path="/crm-card" element={<CRMCard />} />
        <Route path="/optimized-customer-card" element={<OptimizedCustomerCard />} />
        <Route path="/dual-card" element={<DualCard />} />
        <Route path="/plan-recommendation-card" element={<PlanRecommendationCard />} />
        <Route path="/history-records" element={<HistoryRecords />} />
        <Route path="/composite-customer-profile" element={<CompositeCustomerProfile />} />
        <Route path="/ai-workspace" element={<AIWorkspacePage />} />
        <Route path="/digital-human-chat" element={<DigitalHumanChat />} />
        <Route path="/digital-human-chat-switch" element={<DigitalHumanChatSwitch />} />
        <Route path="/digital-human-chat-screen-efficiency" element={<DigitalHumanChatScreenEfficiency />} />
        <Route path="/digital-human-chat-context" element={<DigitalHumanChatWithContext />} />
        <Route path="/composite-chat" element={<CompositeDigitalHumanChat />} />
        <Route path="/customer-profile" element={<CustomerProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
