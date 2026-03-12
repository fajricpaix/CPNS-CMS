import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

type TKPOption = {
  label?: string;
  score?: number;
  text?: string;
};

interface TKPDetailDialogProps {
  open: boolean;
  title: string;
  questionText: string;
  options?: TKPOption[];
  onClose: () => void;
}

const formatOptionScore = (option: TKPOption) => {
  return `${(option.label ?? "-").toUpperCase()}. ${option.score ?? "-"} Point: ${option.text ?? "-"}`;
};

export const TKPDetailDialog = ({
  open,
  title,
  questionText,
  options,
  onClose,
}: TKPDetailDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Soal
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {questionText}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Pilihan Jawaban dan Skor
        </Typography>
        {options?.length ? (
          <List dense sx={{ pt: 0, mb: 2 }}>
            {options.map((option, optionIndex) => (
              <ListItem key={`option-${optionIndex}`} sx={{ px: 0 }}>
                <ListItemText primary={formatOptionScore(option)} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            -
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};
