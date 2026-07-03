import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './Gallery.css';

const generatePages = () => {
  const pages = ['portada.jpeg'];
  for (let i = 1; i <= 28; i++) {
    pages.push(`${i}.jpeg`);
  }
  pages.push('contraportada.jpeg');
  return pages.map(p => `/assets/pages/${p}`);
};

const PAGE_ASSETS = generatePages();

const Gallery = ({ onBack, onSelectPage }) => {
  return (
    <div className="gallery-view fade-in">
      <div className="gallery-header glass-panel">
        <button className="icon-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2>Seleccionar Página</h2>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="gallery-grid">
        {PAGE_ASSETS.map((src, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => onSelectPage(index)}
          >
            <img src={src} alt={`Página ${index}`} />
            <div className="page-number">
              {index === 0 ? 'Portada' : index === PAGE_ASSETS.length - 1 ? 'Contraportada' : `Pág ${index}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
