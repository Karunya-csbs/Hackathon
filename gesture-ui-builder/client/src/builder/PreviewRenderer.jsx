import React from 'react';

const PreviewRenderer = ({ layout = [] }) => {
  return (
    <div className="bg-white rounded border p-4 min-h-96 overflow-auto">
      <div className="space-y-4">
        {layout.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p>No components added yet</p>
            <p className="text-sm mt-2">Add components from the library to see preview</p>
          </div>
        ) : (
          layout.map((component, index) => renderComponent(component, index))
        )}
      </div>
    </div>
  );
};

function renderComponent(component, key) {
  const { type, props = {} } = component;

  switch (type) {
    case 'Button':
      return (
        <button
          key={key}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {props.text || 'Click Me'}
        </button>
      );

    case 'Card':
      return (
        <div key={key} className="border rounded p-4 bg-gray-50">
          <h3 className="font-bold">{props.title || 'Card Title'}</h3>
          <p className="text-sm text-gray-600">{props.content || 'Card content'}</p>
        </div>
      );

    case 'Navbar':
      return (
        <nav key={key} className="bg-gray-800 text-white p-4 rounded">
          <div className="flex justify-between">
            <span className="font-bold">{props.logo || 'Logo'}</span>
            <div className="space-x-4">
              <a href="#home">Home</a>
              <a href="#about">About</a>
            </div>
          </div>
        </nav>
      );

    case 'Input':
      return (
        <input
          key={key}
          type="text"
          placeholder={props.placeholder || 'Enter text...'}
          className="border rounded px-3 py-2 w-full"
        />
      );

    case 'Grid':
      return (
        <div key={key} className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 p-2 rounded">Item 1</div>
          <div className="bg-gray-100 p-2 rounded">Item 2</div>
          <div className="bg-gray-100 p-2 rounded">Item 3</div>
          <div className="bg-gray-100 p-2 rounded">Item 4</div>
        </div>
      );

    case 'Form':
      return (
        <form key={key} className="border rounded p-4">
          <input
            type="text"
            placeholder="Name"
            className="border rounded px-3 py-2 mb-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2 mb-2 w-full"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      );

    case 'Modal':
      return (
        <div key={key} className="border rounded p-4 bg-white shadow-lg">
          <h2 className="font-bold text-lg mb-2">{props.title || 'Modal'}</h2>
          <p>{props.content || 'Modal content'}</p>
          <button className="bg-gray-500 text-white px-3 py-1 rounded mt-2">Close</button>
        </div>
      );

    case 'Image':
      return (
        <img
          key={key}
          src={props.src || 'https://via.placeholder.com/300'}
          alt={props.alt || 'image'}
          className="rounded max-w-full"
        />
      );

    default:
      return (
        <div key={key} className="p-2 border rounded text-gray-400">
          Unknown component: {type}
        </div>
      );
  }
}

export default PreviewRenderer;