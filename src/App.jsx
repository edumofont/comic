import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './MainMenu';
import ComicReader from './ComicReader';
import Gallery from './Gallery';
import Characters from './Characters';
import { Volume2, VolumeX } from 'lucide-react';
import './App.css';

function App() {
  const [view, setView] = useState('menu'); // 'menu', 'reader', 'gallery'
  const [startPage, setStartPage] = useState(0);
  const [initialSinglePage, setInitialSinglePage] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicEnabled) {
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  const handleStart = () => {
    setStartPage(0);
    setInitialSinglePage(false);
    setView('reader');
  };

  const handlePageSelect = (index, isSingle = false) => {
    setStartPage(index);
    setInitialSinglePage(isSingle);
    setView('reader');
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  const handleStartLarge = () => {
    setStartPage(0);
    setInitialSinglePage(true);
    setView('reader');
  };

  const handleGlobalPrint = () => {
    const pages = ['portada.jpeg'];
    for (let i = 1; i <= 28; i++) pages.push(`${i}.jpeg`);
    pages.push('contraportada.jpeg');
    const PAGE_ASSETS = pages.map(p => `/assets/pages/${p}`);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Imprimir Cómic</title><style>@page { size: auto; margin: 0mm; } body { margin: 0; padding: 0; background: white; text-align: center; } img { width: 100%; height: 100vh; object-fit: contain; page-break-after: always; display: block; }</style></head><body>');
    PAGE_ASSETS.forEach(src => {
      printWindow.document.write(`<img src="${window.location.origin}${src}" onload="window.imagesLoaded = (window.imagesLoaded || 0) + 1; if(window.imagesLoaded === ${PAGE_ASSETS.length}) { window.print(); }" />`);
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  };

  return (
    <div className="app-container">
      <audio 
        ref={audioRef} 
        src="/assets/audio/music.mp3" 
        loop 
      />
      
      <button className="music-toggle" onClick={toggleMusic}>
        {musicEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {view === 'menu' && (
        <MainMenu 
          onStart={handleStart} 
          onStartLarge={handleStartLarge}
          onOpenGallery={() => setView('gallery')}
          onOpenCharacters={() => setView('characters')}
          onPrint={handleGlobalPrint}
        />
      )}
      
      {view === 'characters' && (
        <Characters onBack={() => setView('menu')} />
      )}
      
      {view === 'gallery' && (
        <Gallery 
          onBack={() => setView('menu')} 
          onSelectPage={handlePageSelect} 
        />
      )}
      
      {view === 'reader' && (
        <ComicReader 
          startPage={startPage} 
          initialSinglePage={initialSinglePage}
          onBack={() => setView('menu')} 
          musicEnabled={musicEnabled}
        />
      )}
    </div>
  );
}

export default App;
