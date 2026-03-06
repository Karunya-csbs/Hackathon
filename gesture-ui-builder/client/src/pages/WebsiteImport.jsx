import React, { useState } from 'react';
import axios from 'axios';

const WebsiteImport = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/import`,
        { url }
      );
      setComponents(response.data.components || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import website');
      console.error('Error importing website:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Import Website</h1>

      <form onSubmit={handleImport} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {components.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-4">Detected Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((comp, index) => (
              <div key={index} className="border rounded p-4 bg-gray-50">
                <h3 className="font-semibold mb-2">{comp.type}</h3>
                <p className="text-sm text-gray-600 mb-2">{comp.description || 'No description'}</p>
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                  Add to Builder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteImport;