
import React from 'react';
import { ConfigProvider, HashRouter as Router, Routes, Route, useConfig } from './context/ConfigContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Quote from './pages/Quote';
import Admin from './pages/Admin';
import { Login, Dashboard } from './pages/Auth';
import { Capabilities, SMTAssembly, About, Contact, ThreeDPrinting, CNC, Help, Engineering } from './pages/StaticPages';

// Wrapper to access config inside Router
const AppRoutes = () => {
  const { config } = useConfig();
  
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Static Route Mappings for System Pages */}
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/smt" element={<SMTAssembly />} />
        <Route path="/3d-printing" element={<ThreeDPrinting />} />
        <Route path="/cnc" element={<CNC />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/engineering" element={<Engineering />} />
        
        {/* Dynamic Route Generation for Created Pages */}
        {Object.keys(config.pages).map(key => {
            // Skip system pages that are hardcoded above to avoid double render if key matches
            if (['capabilities','smt','3d-printing','cnc','about','contact','help','engineering'].includes(key)) return null;
            
            // Use a Generic Dynamic Page Component
            return (
                <Route 
                    key={key} 
                    path={`/${key}`} 
                    element={<About />} // Reusing About/DynamicPage component which reads from context based on key (logic inside StaticPages needs update or passing prop)
                />
            );
        })}
    </Routes>
  );
};

// We need to modify StaticPages.tsx to accept props or read path. 
// For now, re-using 'About' which is actually DynamicPage wrapper in previous code.

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-grow">
             <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
