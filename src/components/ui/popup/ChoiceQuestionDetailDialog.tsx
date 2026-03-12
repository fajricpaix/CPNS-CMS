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

type ChoiceOption = {
  label?: string;
  text?: string;
};

interface ChoiceQuestionDetailDialogProps {
  open: boolean;
  title: string;
  questionText: string;
  options?: ChoiceOption[];
  answer?: string;
  explanation?: string;
  onClose: () => void;
}

export const ChoiceQuestionDetailDialog = ({
  open,
  title,
  questionText,
  options,
  answer,
  explanation,
  onClose,
}: ChoiceQuestionDetailDialogProps) => {
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
          Pilihan Jawaban
        </Typography>
        {options?.length ? (
          <List dense sx={{ pt: 0, mb: 2 }}>
            {options.map((option, optionIndex) => (
              <ListItem key={`option-${optionIndex}`} sx={{ px: 0 }}>
                <ListItemText
                  primary={`${(option.label ?? "").toUpperCase()}. ${option.text ?? "-"}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ mb: 2 }}>
            -
          </Typography>
        )}

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Jawaban
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 700 }}>
          {answer ?? "-"}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Pembahasan
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {explanation ?? "-"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};
