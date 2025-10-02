import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useToastEnhanced() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'success' });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'error' });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'warning' });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: 'info' });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}
