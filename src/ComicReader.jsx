import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Home, Play, Printer, Maximize2, Columns } from 'lucide-react';
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
  const [singlePage, setSinglePage] = useState(initialSinglePage); // false = Pequeño (2 págs), true = Grande (1 pág)

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
          // Si cambiamos a doble página y estábamos en impar, ajustamos para que se vea bien
          let target = currentPage;
          if (!singlePage && target % 2 !== 0 && target > 0) target -= 1;
          bookRef.current.pageFlip().turnToPage(target);
        } catch (e) {}
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [singlePage]);

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
    if (isAutoplay) {
      interval = setInterval(() => {
        if (bookRef.current && bookRef.current.pageFlip()) {
          bookRef.current.pageFlip().flipNext();
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const onPage = (e) => {
    setCurrentPage(e.data);
    playFlipSound();
  };

  const nextButtonClick = () => {
    playFlipSound();
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    playFlipSound();
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().flipPrev();
    }
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

  const isMobile = windowSize.width < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  
  if (isMobile) {
    return (
      <div className="comic-reader fade-in" style={{ backgroundColor: '#111', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <audio ref={sfxRef} src={sfxBase64} preload="auto" />
        <div className="navbar glass-panel" style={{ zIndex: 10 }}>
          <button className="icon-btn" onClick={onBack} title="Volver al menú">
            <Home size={24} />
          </button>
          <div className="navbar-center">
            <span className="page-counter">{currentPage + 1} / {PAGE_ASSETS.length}</span>
          </div>
          <div className="navbar-actions">
            <button className={`icon-btn ${isAutoplay ? 'active-auto' : ''}`} onClick={() => setIsAutoplay(!isAutoplay)}>
              <Play size={20} />
            </button>
          </div>
        </div>
        <div 
          style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientX - rect.left < rect.width / 3) {
              if (currentPage > 0) { setCurrentPage(currentPage - 1); playFlipSound(); }
            } else {
              if (currentPage < PAGE_ASSETS.length - 1) { setCurrentPage(currentPage + 1); playFlipSound(); }
            }
          }}
        >
          <img src={PAGE_ASSETS[currentPage]} alt={`Page ${currentPage}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      </div>
    );
  }

  // En modo 1 página, hacemos que ocupe casi toda la pantalla verticalmente
  // Para que react-pageflip no muestre 2 páginas, el ancho DEBE ser menor que el alto
  const bookHeight = singlePage ? windowSize.height - 120 : 550;
  const bookWidth = singlePage ? Math.min(windowSize.width - 40, bookHeight * 0.95) : (windowSize.width / 2.5);

  return (
    <div className="comic-reader fade-in">
      <audio ref={sfxRef} src={sfxBase64} preload="auto" />
      
      <div className="navbar glass-panel">
        <button className="icon-btn" onClick={onBack} title="Volver al menú">
          <Home size={24} />
        </button>
        <div className="navbar-center">
          <span className="page-counter">Página {currentPage + 1} de {PAGE_ASSETS.length}</span>
        </div>
        <div className="navbar-actions">
          <button 
            className="icon-btn" 
            onClick={() => setSinglePage(!singlePage)}
            title={singlePage ? "Modo Pequeño (2 Páginas)" : "Modo Grande (1 Página)"}
          >
            {singlePage ? <Columns size={20} /> : <Maximize2 size={20} />}
          </button>
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

      <div className="book-container">
        <HTMLFlipBook 
          key={singlePage ? 'single' : 'double'} 
          width={bookWidth} height={bookHeight} size="stretch"
          minWidth={315} maxWidth={1000} minHeight={400} maxHeight={1533}
          maxShadowOpacity={0.5} showCover={!singlePage} mobileScrollSupport={true}
          usePortrait={singlePage || isMobile} 
          className="flip-book" onFlip={onPage} ref={bookRef}
        >
          {PAGE_ASSETS.map((src, index) => (
            <div className="page" key={index}>
              <img src={src} alt={`Page ${index}`} className="page-image" />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default ComicReader;
