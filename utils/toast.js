import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => toast.success(message, {
    style: {
      background: '#151525',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    iconTheme: {
      primary: '#4F8EF7',
      secondary: '#fff',
    },
  }),
  error: (message) => toast.error(message, {
    style: {
      background: '#151525',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  }),
  loading: (message) => toast.loading(message, {
    style: {
      background: '#151525',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
  }),
  dismiss: (toastId) => toast.dismiss(toastId),
};
