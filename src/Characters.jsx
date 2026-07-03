import React from 'react';
import { Home } from 'lucide-react';
import './Characters.css';

const CHARACTERS = [
  {
    name: "Edu",
    role: "El Relaciones Públicas",
    desc: "Amante incondicional de los tiburones, experto en bailes espontáneos y el mejor relaciones públicas que verás en la isla. Le encanta hablar con la gente.\n\nHabilidad especial: Dar la chapa con anécdotas de vacaciones durante todo el trayecto en coche sin coger aire.",
    avatarClass: "avatar-edu",
    alignment: "left"
  },
  {
    name: "Ruth",
    role: "La Salvavidas",
    desc: "La verdadera heroína del grupo. Si se pierden unas llaves, ella las encuentra. Es una crack absoluta del buceo y modelo experta en poses épicas (sobre todo si lleva un machete).\n\nHabilidad especial: Dominar cualquier situación mientras los demás discuten.",
    avatarClass: "avatar-ruth",
    alignment: "right"
  },
  {
    name: "Mar y Paula",
    role: "El Comité de Bienvenida",
    desc: "Nuestras co-protagonistas y salvadoras en el aeropuerto. Viven en una competición constante (y muy seria) por ver quién de las dos conduce mejor.\n\nHabilidad especial: Aguantar estoicamente los monólogos vacacionales de Edu en los asientos de atrás mientras se pelean por el volante.",
    avatarClass: "avatar-marypaula",
    alignment: "center"
  }
];

const Characters = ({ onBack }) => {
  return (
    <div className="characters-view fade-in">
      <div className="chars-header glass-panel">
        <button className="icon-btn" onClick={onBack} title="Volver al Inicio">
          <Home size={24} />
        </button>
        <h2>Perfiles de Personajes</h2>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div className="chars-container">
        {CHARACTERS.map((char, idx) => (
          <div key={idx} className={`char-card glass-panel align-${char.alignment}`}>
            <div className={`char-avatar ${char.avatarClass}`}></div>
            <div className="char-content">
              <h3>{char.name}</h3>
              <h4>{char.role}</h4>
              <p>{char.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Characters;
