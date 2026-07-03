import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Home, Play, Printer, Maximize2, Columns, ZoomIn, X } from 'lucide-react';
import { sfxBase64 } from './sfx';
import './ComicReader.css';

const generatePages = () => {
  const pages = ['portada.jpeg'];
  for (let i = 1; i <= 28; i++) {
    pages.push(`${i}.jpeg`);
  }
  pages.push('contraportada.jpeg');
  return pages.map(p => `/assets/pages/${p}`);
};

const PAGE_ASSETS = generatePages();

const ComicReader = ({ startPage = 0, initialSinglePage = false, onBack, musicEnabled }) => {
  const bookRef = useRef();
  const sfxRef = useRef();
  const [currentPage, setCurrentPage] = useState(startPage);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
  
  const isMobileDevice = windowSize.width < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const [singlePage, setSinglePage] = useState(initialSinglePage || isMobileDevice);

  const playFlipSound = () => {
    if (sfxRef.current) {
      sfxRef.current.currentTime = 0;
      sfxRef.current.play().catch(e => console.log(e));
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sincronizar página al cambiar de modo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bookRef.current && bookRef.current.pageFlip()) {
        try {
          let target = currentPage;
          if (!singlePage && target % 2 !== 0 && target > 0) target -= 1;
          bookRef.current.pageFlip().turnToPage(target);
        } catch (e) {}
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [singlePage, currentPage]);

  // Ir a la página seleccionada al cargar el visor
  useEffect(() => {
    if (startPage > 0) {
      const timer = setTimeout(() => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          try {
            bookRef.current.pageFlip().turnToPage(startPage);
          } catch (e) {}
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [startPage]);

  useEffect(() => {
    let interval;
    if (isAutoplay && !zoomMode) {
      interval = setInterval(() => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipNext();
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, zoomMode]);

  const onPage = (e) => {
    setCurrentPage(e.data);
    playFlipSound();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Imprimir Cómic</title><style>body { text-align: center; margin: 0; padding: 0; } img { max-width: 100%; margin-bottom: 20px; page-break-after: always; display: block; margin-left: auto; margin-right: auto; }</style></head><body>');
    PAGE_ASSETS.forEach(src => {
      printWindow.document.write(`<img src="${window.location.origin}${src}" onload="window.imagesLoaded = (window.imagesLoaded || 0) + 1; if(window.imagesLoaded === ${PAGE_ASSETS.length}) { window.print(); }" />`);
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  };

  const wrapperWidth = windowSize.width;
  const wrapperHeight = windowSize.height - 120;
  const isSingleMode = singlePage || isMobileDevice;
  
  let bookWidth, bookHeight, bookSize;
  if (isSingleMode) {
    bookSize = "fixed";
    bookWidth = wrapperWidth - (isMobileDevice ? 0 : 40);
    bookHeight = Math.max(wrapperHeight, bookWidth + 1);
  } else {
    bookSize = "stretch";
    bookWidth = wrapperWidth / 2.5;
    bookHeight = Math.max(wrapperHeight, 550);
  }

  return (
    <div className="comic-reader fade-in" style={{ backgroundColor: '#111', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <audio ref={sfxRef} src={sfxBase64} preload="auto" />
      
      {zoomMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#000', zIndex: 9999, overflow: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <button 
            onClick={() => setZoomMode(false)}
            style={{
              position: 'fixed', top: 20, right: 20, zIndex: 10000,
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
              padding: 10, color: '#fff', cursor: 'pointer'
            }}
          >
            <X size={30} />
          </button>
          <img 
            src={PAGE_ASSETS[currentPage]} 
            alt="Zoomed" 
            style={{ width: '90%', height: 'auto', objectFit: 'contain', transition: 'width 0.3s ease' }} 
            onClick={(e) => {
              if (e.target.style.width === '250%') {
                e.target.style.width = '90%';
              } else {
                e.target.style.width = '250%';
              }
            }}
          />
        </div>
      )}

      <div className="navbar glass-panel" style={{ zIndex: 10 }}>
        <button className="icon-btn" onClick={onBack} title="Volver al menú">
          <Home size={24} />
        </button>
        <div className="navbar-center">
          <span className="page-counter">Página {currentPage + 1} de {PAGE_ASSETS.length}</span>
        </div>
        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setZoomMode(true)} title="Ampliar imagen">
            <ZoomIn size={20} />
          </button>
          {!isMobileDevice && (
            <button 
              className="icon-btn" 
              onClick={() => setSinglePage(!singlePage)}
              title={singlePage ? "Modo Pequeño (2 Páginas)" : "Modo Grande (1 Página)"}
            >
              {singlePage ? <Columns size={20} /> : <Maximize2 size={20} />}
            </button>
          )}
          <button 
            className={`icon-btn ${isAutoplay ? 'active-auto' : ''}`} 
            onClick={() => setIsAutoplay(!isAutoplay)}
            title="Auto-Play (5s)"
          >
            <Play size={20} />
          </button>
          <button className="icon-btn" onClick={handlePrint} title="Imprimir / PDF">
            <Printer size={20} />
          </button>
        </div>
      </div>

      <div 
        className="book-container" 
        style={{ 
          flex: 1, 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden' 
        }}
      >
        <HTMLFlipBook 
          key={isSingleMode ? 'single' : 'double'} 
          width={bookWidth} 
          height={bookHeight} 
          size={bookSize}
          minWidth={315} maxWidth={3000} minHeight={400} maxHeight={3000}
          maxShadowOpacity={0.5} 
          showCover={!isSingleMode} 
          mobileScrollSupport={true}
          usePortrait={isSingleMode} 
          className="flip-book" 
          onFlip={onPage} 
          ref={bookRef}
        >
          {PAGE_ASSETS.map((src, index) => (
            <div className="page" key={index} style={{ backgroundColor: '#111' }}>
              <img 
                src={src} 
                alt={`Page ${index}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default ComicReader;
