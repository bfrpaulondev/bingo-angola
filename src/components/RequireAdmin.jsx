import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAdmin({ children }) {
  // Exemplo: troca por autenticação real/JWT
  const isAdmin = localStorage.getItem('token') === 'admin';
  const location = useLocation();

  if (!isAdmin) {
    // Pode redirecionar para login ou mostrar mensagem
    return <Navigate to="/" state={{ from: location }} replace />;
    // Ou, para mostrar um aviso ao invés de redirect:
    // return <div style={{ textAlign: 'center', marginTop: 50 }}>Acesso restrito</div>;
  }
  return children;
}
