// src/components/Footer.jsx
import React from 'react';
import { Settings, Download as DownloadIcon, Printer, Maximize2 } from 'lucide-react';
import './Footer.css';

export default function Footer({
  onSettingsClick,
  onDownload,
  onPrint,
  onFullScreen,
}) {
  return (
    <footer className="footer-bar">
      {/* Lado izquierdo */}
      <div className="footer-left">
        <button
          type="button"
          className="footer-btn"
          aria-label="Ajustes"
          onClick={onSettingsClick}
        >
          <Settings size={22} />
        </button>

        <img
          src="/assets/ApelieLOGO.png"
          alt="Apelie Robotics"
          className="footer-logo"
        />
      </div>

      {/* Lado derecho */}
      <div className="footer-right">
        <button
          type="button"
          className="footer-btn"
          aria-label="Descargar"
          onClick={onDownload}
        >
          <DownloadIcon size={22} />
        </button>

        <button
          type="button"
          className="footer-btn"
          aria-label="Imprimir"
          onClick={onPrint}
        >
          <Printer size={22} />
        </button>

        <button
          type="button"
          className="footer-btn"
          aria-label="Pantalla completa"
          onClick={onFullScreen}
        >
          <Maximize2 size={22} />
        </button>
      </div>
    </footer>
  );
}
