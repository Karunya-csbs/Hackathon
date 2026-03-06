import React from 'react';

const components = {
  Button: () => (
    <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>
  ),
  Card: () => (
    <div className="border rounded p-4 bg-gray-50">
      <h3 className="font-bold">Card Title</h3>
      <p className="text-sm text-gray-600">Card content goes here</p>
    </div>
  ),
  Navbar: () => (
    <nav className="bg-gray-800 text-white p-4 rounded">
      <div className="flex justify-between">
        <span className="font-bold">Logo</span>
        <div className="space-x-4">
          <a href="#">Home</a>
          <a href="#">About</a>
        </div>
      </div>
    </nav>
  ),
  Input: () => (
    <input
      type="text"
      placeholder="Enter text..."
      className="border rounded px-3 py-2 w-full"
    />
  ),
  Grid: () => (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-gray-100 p-2 rounded">Item 1</div>
      <div className="bg-gray-100 p-2 rounded">Item 2</div>
      <div className="bg-gray-100 p-2 rounded">Item 3</div>
      <div className="bg-gray-100 p-2 rounded">Item 4</div>
    </div>
  ),
};

const DraggableComponent = ({ component, index }) => {
  const Component = components[component.type];
  return (
    <div className="p-2 border rounded bg-blue-50 cursor-grab">
      <div className="text-xs font-bold text-gray-500 mb-2">{component.type}</div>
      {Component ? <Component /> : <div>Unknown component</div>}
    </div>
  );
};

export default DraggableComponent;