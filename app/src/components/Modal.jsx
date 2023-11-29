import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import Button from './Button';

function Modal({ open, onClose, title, error = false, submitBtn, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 24,
          background: '#D8F3DC',
        },
      }}
    >
      <DialogTitle
        variant='h4'
        align='center'
        sx={{
          fontFamily:
            "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        {children}
        {error && (
          <div>Please make sure all fields have been properly filled.</div>
        )}
      </DialogContent>
      {submitBtn && (
        <DialogActions>
          <Button title='Go Back' autoFocus onClick={onClose} />
          {submitBtn}
        </DialogActions>
      )}
    </Dialog>
  );
}
export default Modal;
