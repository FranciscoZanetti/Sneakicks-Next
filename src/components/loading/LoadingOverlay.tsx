import React from 'react';

interface LoadingOverlayProps {
    text: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.loader}></div>
        <div style={styles.text}>{text}</div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed' as React.CSSProperties['position'],
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    border: '12px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '12px solid #888',
    width: '80px',
    height: '80px',
    animation: 'spin 1.5s linear infinite',
  },
  text: {
    marginTop: '15px',
    fontSize: '18px',
    color: '#555',
    fontWeight: 'bold',
  },
};

// Estilos para la animación de la ruedita
const loaderAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inyectar la animación globalmente
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(loaderAnimation, styleSheet.cssRules.length);
}

export default LoadingOverlay;
