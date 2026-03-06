import React, { useState } from 'react';

const CopyButton = ({ code = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 text-sm rounded transition ${
        copied
          ? 'bg-green-500 text-white'
          : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
      }`}
    >
      {copied ? '✓ Copied' : 'Copy Code'}
    </button>
  );
};

export default CopyButton;