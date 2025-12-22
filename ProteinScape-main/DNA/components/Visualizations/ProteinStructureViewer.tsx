import React, { useEffect, useRef } from 'react';

// Declare 3Dmol as a global
declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface ProteinStructureViewerProps {
  pdbContent: string;
  style?: 'cartoon' | 'stick' | 'sphere' | 'line';
  width?: number;
  height?: number;
}

const ProteinStructureViewer: React.FC<ProteinStructureViewerProps> = ({
  pdbContent,
  style = 'cartoon',
  width = 800,
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Wait for 3Dmol to be available (it's loaded in index.html)
    const checkAndInitialize = () => {
      if (window.$3Dmol) {
        initializeViewer();
      } else {
        // If not loaded yet, wait a bit and try again
        setTimeout(checkAndInitialize, 100);
      }
    };

    function initializeViewer() {
      if (!containerRef.current || !pdbContent || !window.$3Dmol) return;

      // Initialize 3Dmol viewer
      if (!viewerRef.current) {
        viewerRef.current = window.$3Dmol.createViewer(containerRef.current, {
          defaultcolors: window.$3Dmol.rasmolElementColors,
        });
      }

      const viewer = viewerRef.current;

      // Clear previous model
      viewer.clear();

      // Add PDB model
      viewer.addModel(pdbContent, 'pdb');

      // Set style
      if (style === 'cartoon') {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else if (style === 'stick') {
        viewer.setStyle({}, { stick: { color: 'spectrum' } });
      } else if (style === 'sphere') {
        viewer.setStyle({}, { sphere: { color: 'spectrum', scale: 0.3 } });
      } else {
        viewer.setStyle({}, { line: { color: 'spectrum' } });
      }

      // Set background
      viewer.setBackgroundColor(0xffffff);

      // Zoom to fit
      viewer.zoomTo();

      // Render
      viewer.render();
    }

    checkAndInitialize();

    // Cleanup function
    return () => {
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [pdbContent, style]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }} 
    />
  );
};

export default ProteinStructureViewer;

