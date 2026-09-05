import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { SystemNoticeToast } from './components/common/SystemNoticeToast';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SonarAnalysisPage } from './pages/SonarAnalysisPage';
import { DetectionMapPage } from './pages/DetectionMapPage';
import { ReportsPage } from './pages/ReportsPage';
import { LiveFeedPage } from './pages/LiveFeedPage';
import { SystemPage } from './pages/SystemPage';

export const App: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-black text-[#cccccc] font-mono flex flex-col relative selection:bg-white selection:text-black">
      {/* Background Subtle Tech Grid */}
      <div className="fixed inset-0 tech-grid pointer-events-none opacity-30 z-0" />

      {/* Fixed Technical Navbar (shown on all pages or with compact style on landing) */}
      {!isLandingPage && <Navbar />}

      {/* Main Page Content */}
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sonar-analysis" element={<SonarAnalysisPage />} />
          <Route path="/detection-map" element={<DetectionMapPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/live-feed" element={<LiveFeedPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Periodic Autonomous Machine Log Notifications Toast */}
      {!isLandingPage && <SystemNoticeToast />}
    </div>
  );
};

export default App;
