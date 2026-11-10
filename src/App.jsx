import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toasts from './components/Toasts';
import Dashboard from './pages/Dashboard';
import CreateResume from './pages/CreateResume';
import Templates from './pages/Templates';
import Settings from './pages/Settings';

function Shell() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="flex h-full overflow-hidden bg-canvas">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenu={() => setMenu(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resumes" element={<Dashboard view="resumes" />} />
            <Route path="/create" element={<CreateResume />} />
            <Route path="/editor/:id" element={<CreateResume />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Shell />
      </ResumeProvider>
    </BrowserRouter>
  );
}
