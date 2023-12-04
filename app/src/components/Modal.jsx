import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

function Modal({ open, onClose, title, submitBtn, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      transitionDuration={300}
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
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: 'absolute',
          left: 4,
          top: 4,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{children}</DialogContent>
      {submitBtn && <DialogActions>{submitBtn}</DialogActions>}
    </Dialog>
  );
}
export default Modal;
