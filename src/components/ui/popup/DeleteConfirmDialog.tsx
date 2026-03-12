import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({
  open,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus soal ini?",
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Batal
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  );
};
