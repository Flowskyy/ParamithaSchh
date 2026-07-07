import toast from 'react-hot-toast';
import CustomToast from '../components/CustomToast';

export const toastSuccess = (message, details = null, toastId = null) => {
  if (toastId) toast.dismiss(toastId);
  return toast.custom((t) => <CustomToast t={t} type="success" message={message} details={details} />, {
    duration: 3000,
  });
};

export const toastError = (message, details = null, toastId = null) => {
  if (toastId) toast.dismiss(toastId);
  return toast.custom((t) => <CustomToast t={t} type="error" message={message} details={details} />, {
    duration: 5000,
  });
};

export const toastLoading = (message, details = null) => toast.custom((t) => <CustomToast t={t} type="loading" message={message} details={details} />, {
  duration: Infinity,
});

export const toastDismiss = (toastId) => toast.dismiss(toastId);

// Compatibility export for existing code using showToast
export const showToast = {
  success: toastSuccess,
  error: toastError,
  loading: toastLoading,
  dismiss: toastDismiss,
};
