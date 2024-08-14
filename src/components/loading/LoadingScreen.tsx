import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loader}></div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fff',
  },
  loader: {
    border: '12px solid #f3f3f3', // Bordes más delgados
    borderRadius: '50%',
    borderTop: '12px solid #888', // Color gris para la parte superior
    width: '80px', // Tamaño más pequeño
    height: '80px', // Tamaño más pequeño
    animation: 'spin 1.5s linear infinite', // Gira más rápido
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

export default LoadingScreen;
