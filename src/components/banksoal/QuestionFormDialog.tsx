import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export type QuestionFormOption = { label: string; text: string };

export type QuestionFormData = {
  questionText: string;
  options: QuestionFormOption[];
  answer: string;
  explanation: string;
};

export const DEFAULT_QUESTION_LABELS = ["a", "b", "c", "d", "e"];

export const getInitialQuestionFormData = (): QuestionFormData => ({
  questionText: "",
  options: DEFAULT_QUESTION_LABELS.map((l) => ({ label: l, text: "" })),
  answer: "",
  explanation: "",
});

interface QuestionFormDialogProps {
  open: boolean;
  mode: "add" | "edit";
  title: string;
  formData: QuestionFormData;
  onChange: (data: QuestionFormData) => void;
  onClose: () => void;
  onSave: () => void;
}

export const QuestionFormDialog = ({
  open,
  mode,
  title,
  formData,
  onChange,
  onClose,
  onSave,
}: QuestionFormDialogProps) => {
  const handleOptionChange = (optIndex: number, field: keyof QuestionFormOption, value: string) => {
    const updated = [...formData.options];
    updated[optIndex] = { ...updated[optIndex], [field]: value };
    onChange({ ...formData, options: updated });
  };

  const handleAddOption = () => {
    onChange({ ...formData, options: [...formData.options, { label: "", text: "" }] });
  };

  const handleRemoveOption = (optIndex: number) => {
    onChange({
      ...formData,
      options: formData.options.filter((_, i) => i !== optIndex),
      answer: formData.options[optIndex]?.label === formData.answer ? "" : formData.answer,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "add" ? `Tambah ${title}` : `Edit ${title}`}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Teks Soal"
            multiline
            minRows={3}
            fullWidth
            value={formData.questionText}
            onChange={(e) => onChange({ ...formData, questionText: e.target.value })}
          />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Pilihan Jawaban
            </Typography>
            <Stack spacing={1.5}>
              {formData.options.map((opt, optIndex) => (
                <Stack key={optIndex} direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Label"
                    size="small"
                    sx={{ width: 80 }}
                    value={opt.label}
                    onChange={(e) => handleOptionChange(optIndex, "label", e.target.value)}
                  />
                  <TextField
                    label="Teks Pilihan"
                    size="small"
                    fullWidth
                    value={opt.text}
                    onChange={(e) => handleOptionChange(optIndex, "text", e.target.value)}
                  />
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleRemoveOption(optIndex)}
                    disabled={formData.options.length <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Button startIcon={<AddIcon />} size="small" sx={{ mt: 1 }} onClick={handleAddOption}>
              Tambah Pilihan
            </Button>
          </Box>

          <Divider />

          <FormControl fullWidth size="small">
            <InputLabel>Kunci Jawaban</InputLabel>
            <Select
              label="Kunci Jawaban"
              value={formData.answer}
              onChange={(e) => onChange({ ...formData, answer: e.target.value })}
            >
              {formData.options
                .filter((o) => o.label.trim() !== "")
                .map((o, i) => (
                  <MenuItem key={i} value={o.label.toUpperCase()}>
                    {o.label.toUpperCase()}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Pembahasan"
            multiline
            minRows={3}
            fullWidth
            value={formData.explanation}
            onChange={(e) => onChange({ ...formData, explanation: e.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Batal
        </Button>
        <Button variant="contained" onClick={onSave}>
          {mode === "add" ? "Tambah" : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
