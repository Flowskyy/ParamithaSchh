import toast from 'react-hot-toast';

export const toastSuccess = (message, toastId = null) => {
  if (toastId) toast.dismiss(toastId);
  return toast.success(message, {
    style: {
      background: '#151525',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    iconTheme: {
      primary: '#4F8EF7',
      secondary: '#fff',
    },
  });
};

export const toastError = (message, toastId = null) => {
  if (toastId) toast.dismiss(toastId);
  return toast.error(message, {
    style: {
      background: '#151525',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    iconTheme: {
      primary: '#EF4444',
      secondary: '#fff',
    },
  });
};

export const toastLoading = (message) => toast.loading(message, {
  style: {
    background: '#151525',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
  },
});

export const toastDismiss = (toastId) => toast.dismiss(toastId);

// Compatibility export for existing code using showToast
export const showToast = {
  success: toastSuccess,
  error: toastError,
  loading: toastLoading,
  dismiss: toastDismiss,
};
