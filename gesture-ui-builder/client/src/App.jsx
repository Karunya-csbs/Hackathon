import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Builder from './pages/Builder';

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* header placeholder */}
      <header className="bg-gray-800 text-white p-2 flex justify-between">
        <div className="font-bold">Gesture UI Builder</div>
        <nav className="space-x-4">
          <a href="/builder">Builder</a>
        </nav>
        <div>User</div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/builder" />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;