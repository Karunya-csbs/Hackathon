import { useState, useCallback } from 'react';
import ComponentGenerator from '../builder/ComponentGenerator';

const useCodeGeneration = (layout) => {
  const [code, setCode] = useState(ComponentGenerator.generateEmptyApp());

  const generateCode = useCallback(() => {
    const generatedCode = ComponentGenerator.generateComponentCode(layout);
    setCode(generatedCode);
    return generatedCode;
  }, [layout]);

  return { code, generateCode };
};

export default useCodeGeneration;