class LayoutBuilder {
  static createLayout(components) {
    return components.map(comp => ({
      type: comp.type || 'Button',
      props: comp.props || {}
    }));
  }

  static addComponent(layout, component) {
    return [...layout, component];
  }

  static removeComponent(layout, index) {
    return layout.filter((_, i) => i !== index);
  }

  static updateComponent(layout, index, updatedComponent) {
    const newLayout = [...layout];
    newLayout[index] = updatedComponent;
    return newLayout;
  }

  static moveComponent(layout, fromIndex, toIndex) {
    const newLayout = [...layout];
    const [item] = newLayout.splice(fromIndex, 1);
    newLayout.splice(toIndex, 0, item);
    return newLayout;
  }

  static clearLayout() {
    return [];
  }

  static exportToJSON(layout) {
    return JSON.stringify(layout, null, 2);
  }

  static importFromJSON(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Invalid JSON:', error);
      return [];
    }
  }
}

export default LayoutBuilder;