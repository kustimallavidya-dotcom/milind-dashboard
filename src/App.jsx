import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BusinessDetail from './pages/BusinessDetail';
import AllTasks from './pages/AllTasks';
// import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/tasks" element={<AllTasks />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
