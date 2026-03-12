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
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export type TKPFormOption = { label: string; score: string; text: string };

export type TKPFormData = {
  questionText: string;
  options: TKPFormOption[];
  explanation: string;
};

export const DEFAULT_TKP_LABELS = ["A", "B", "C", "D", "E"];

export const getInitialTKPFormData = (): TKPFormData => ({
  questionText: "",
  options: DEFAULT_TKP_LABELS.map((l) => ({ label: l, score: "", text: "" })),
  explanation: "",
});

interface TKPFormDialogProps {
  open: boolean;
  mode: "add" | "edit";
  formData: TKPFormData;
  onChange: (data: TKPFormData) => void;
  onClose: () => void;
  onSave: () => void;
}

export const TKPFormDialog = ({
  open,
  mode,
  formData,
  onChange,
  onClose,
  onSave,
}: TKPFormDialogProps) => {
  const handleOptionChange = (optIndex: number, field: keyof TKPFormOption, value: string) => {
    const updated = [...formData.options];
    updated[optIndex] = { ...updated[optIndex], [field]: value };
    onChange({ ...formData, options: updated });
  };

  const handleAddOption = () => {
    onChange({ ...formData, options: [...formData.options, { label: "", score: "", text: "" }] });
  };

  const handleRemoveOption = (optIndex: number) => {
    onChange({
      ...formData,
      options: formData.options.filter((_, i) => i !== optIndex),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "add" ? "Tambah Soal TKP" : "Edit Soal TKP"}</DialogTitle>
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
              Pilihan Jawaban &amp; Skor
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
                  <TextField
                    label="Skor"
                    size="small"
                    type="number"
                    sx={{ width: 110 }}
                    value={opt.score}
                    onChange={(e) => handleOptionChange(optIndex, "score", e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">pt</InputAdornment>,
                    }}
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
