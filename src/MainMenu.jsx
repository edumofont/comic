import React, { useState } from 'react';
import { Play, Grid, Info, Users, X, Maximize2, Printer } from 'lucide-react';
import './MainMenu.css';

const MainMenu = ({ onStart, onStartLarge, onOpenGallery, onOpenCharacters, onPrint }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCredits, setShowCredits] = useState(false);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <div className="main-menu fade-in" onMouseMove={handleMouseMove}>
      {/* Background with Parallax */}
      <div 
        className="parallax-bg"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
          backgroundImage: `url('/assets/pages/portada.jpeg')`
        }}
      />
      
      <div className="overlay"></div>

      <div className="content-container">
        <div className="glass-panel menu-panel">
          <h1 className="title">Aventura en la Isla</h1>
          <p className="subtitle">Edu y Ruth - Cómic Interactivo</p>
          
          <div className="menu-buttons">
            <button className="menu-btn primary" onClick={onStart}>
              <Play size={20} /> Leer (Libro 3D)
            </button>
            <button className="menu-btn secondary" onClick={onStartLarge}>
              <Maximize2 size={20} /> Leer (Página Grande)
            </button>
            <button className="menu-btn secondary" onClick={onOpenGallery}>
              <Grid size={20} /> Seleccionar Página
            </button>
            <button className="menu-btn secondary" onClick={onPrint}>
              <Printer size={20} /> Imprimir / PDF
            </button>
            <button className="menu-btn secondary" onClick={onOpenCharacters}>
              <Users size={20} /> Personajes
            </button>
            <button className="menu-btn secondary" onClick={() => setShowCredits(true)}>
              <Info size={20} /> Créditos
            </button>
          </div>
        </div>
      </div>

      {showCredits && (
        <div className="modal-backdrop fade-in" onClick={() => setShowCredits(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowCredits(false)}>
              <X size={24} />
            </button>
            <h2>Créditos</h2>
            <p><strong>Obra:</strong> Edu y Ruth: Aventura en la Isla de Sal</p>
            <p><strong>Desarrollo:</strong> App interactiva Premium</p>
            <p>Disfruta de la experiencia con música, efectos especiales y transiciones 3D.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
