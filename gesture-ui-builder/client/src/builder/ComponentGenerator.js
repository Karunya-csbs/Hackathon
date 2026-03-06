class ComponentGenerator {
  static generateComponentCode(layout) {
    if (!layout || layout.length === 0) {
      return this.generateEmptyApp();
    }

    const imports = this.generateImports(layout);
    const components = this.generateComponentsJSX(layout);

    return `${imports}

function App() {
  return (
    <div className="min-h-screen bg-white">
      ${components}
    </div>
  );
}

export default App;`;
  }

  static generateImports(layout) {
    return `import React from 'react';
import './App.css';`;
  }

  static generateComponentsJSX(layout) {
    return layout.map(component => this.generateComponent(component)).join('\n      ');
  }

  static generateComponent(component) {
    let { type, props = {} } = component;
    // normalise type to lowercase for easier matching
    const rawType = type || '';
    type = rawType.toString().toLowerCase();

    const propsStr = Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    switch (type) {
      case 'button':
        return `<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">${props.text || 'Click Me'}</button>`;
      case 'card':
        return `<div className="border rounded p-4 bg-gray-50 mb-4">
        <h3 className="font-bold">${props.title || 'Card Title'}</h3>
        <p className="text-sm text-gray-600">${props.content || 'Card content'}</p>
      </div>`;
      case 'navbar':
        return `<nav className="bg-gray-800 text-white p-4 rounded mb-4">
        <div className="flex justify-between">
          <span className="font-bold">${props.logo || 'Logo'}</span>
          <div className="space-x-4">
            <a href="#">Home</a>
            <a href="#">About</a>
          </div>
        </div>
      </nav>`;
      case 'input':
        return `<input type="text" placeholder="${props.placeholder || 'Enter text...'}" className="border rounded px-3 py-2 mb-4 w-full" />`;
      case 'grid':
        return `<div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-100 p-2 rounded">Item 1</div>
        <div className="bg-gray-100 p-2 rounded">Item 2</div>
        <div className="bg-gray-100 p-2 rounded">Item 3</div>
        <div className="bg-gray-100 p-2 rounded">Item 4</div>
      </div>`;
      case 'form':
        return `<form className="border rounded p-4 mb-4">
        <input type="text" placeholder="Name" className="border rounded px-3 py-2 mb-2 w-full" />
        <input type="email" placeholder="Email" className="border rounded px-3 py-2 mb-2 w-full" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
      </form>`;
      case 'modal':
        return `<div className="border rounded p-4 mb-4 bg-white shadow-lg">
        <h2 className="font-bold text-lg mb-2">${props.title || 'Modal Title'}</h2>
        <p>${props.content || 'Modal content'}</p>
        <button className="bg-gray-500 text-white px-3 py-1 rounded mt-2">Close</button>
      </div>`;
      case 'image':
        return `<img src="${props.src || 'https://via.placeholder.com/300'}" alt="${props.alt || 'image'}" className="rounded mb-4 max-w-full" />`;
      default:
        // preserve original case if unknown
        return `<div className="p-2 border rounded">Unknown Component: ${rawType}</div>`;
    }
  }

  static generateEmptyApp() {
    return `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <h1 className="text-3xl font-bold p-4">Start building your UI</h1>
    </div>
  );
}

export default App;`;
  }
}

export default ComponentGenerator;