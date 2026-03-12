import { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type TKPOption = {
  label?: string;
  score?: number;
  text?: string;
};

type TKPQuestion = {
  explanation?: string;
  options?: TKPOption[];
  question?: { text?: string } | string;
};

type DummyJson = {
  cpns?: Array<{
    title?: string;
    tkp?: TKPQuestion[];
  }>;
};

const INITIAL_LOAD = 15;
const LOAD_MORE = 10;

export const TKPPage = () => {
  const [questions, setQuestions] = useState<TKPQuestion[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TKPQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTkpQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/dummy.json");
        if (!response.ok) {
          throw new Error("Gagal mengambil data JSON");
        }

        const data = (await response.json()) as DummyJson;
        const tkpSection = data.cpns?.find((item) => item.title === "TKP");
        setQuestions(tkpSection?.tkp ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchTkpQuestions();
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry.isIntersecting) {
          return;
        }

        setVisibleCount((prev) => {
          if (prev >= questions.length) {
            return prev;
          }
          return Math.min(prev + LOAD_MORE, questions.length);
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [questions.length]);

  const visibleQuestions = useMemo(() => {
    return questions.slice(0, visibleCount);
  }, [questions, visibleCount]);

  const getQuestionText = (question: TKPQuestion["question"]) => {
    if (!question) {
      return "-";
    }

    if (typeof question === "string") {
      return question;
    }

    return question.text ?? "-";
  };

  const formatOptionScore = (option: TKPOption) => {
    return `${(option.label ?? "-").toUpperCase()}: ${option.score ?? "-"} Point`;
  };

  const handleAdd = () => {
    alert("Tambah soal belum diimplementasikan.");
  };

  const handleView = (index: number) => {
    const selected = visibleQuestions[index];
    if (!selected) {
      return;
    }

    setSelectedQuestion(selected);
    setSelectedIndex(index);
    setDetailOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedQuestion(null);
    setSelectedIndex(null);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) {
      return;
    }

    setQuestions((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    setVisibleCount((prev) => Math.max(INITIAL_LOAD, prev - 1));
    handleCloseDelete();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Bank Soal TKP
        </Typography>
        <Button variant="text" startIcon={<AddIcon />} onClick={handleAdd}>
          Tambah Soal
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 2.5 }}>
          <Typography color="error.main">{error}</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ width: 50, fontWeight: 700, color: "background.default" }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "background.default" }}>Soal</TableCell>
                  <TableCell sx={{ width: 160, fontWeight: 700, color: "background.default" }}>Jawaban</TableCell>
                  <TableCell align="center" sx={{ width: 150, fontWeight: 700, color: "background.default" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleQuestions.map((item, index) => (
                  <TableRow key={`tkp-${index}`} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getQuestionText(item.question)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {item.options?.length ? (
                          item.options.map((option, optionIndex) => (
                            <Typography key={`tkp-option-${index}-${optionIndex}`} variant="body2">
                              {formatOptionScore(option)}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="info" size="small" onClick={() => handleView(index)}>
                        <RemoveRedEyeRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box ref={loadMoreRef} sx={{ py: 2.5, textAlign: "center", color: "text.secondary" }}>
            {visibleCount < questions.length
              ? `Scroll untuk memuat lebih banyak (${visibleCount}/${questions.length})`
              : `Semua soal sudah dimuat (${questions.length})`}
          </Box>

          <Dialog open={detailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
            <DialogTitle>
              Soal TKP {selectedIndex !== null ? `No. ${selectedIndex + 1}` : ""}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Soal
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getQuestionText(selectedQuestion?.question)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pilihan Jawaban dan Skor
              </Typography>
              {selectedQuestion?.options?.length ? (
                <List dense sx={{ pt: 0, mb: 2 }}>
                  {selectedQuestion.options.map((option, optionIndex) => (
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

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pembahasan
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {selectedQuestion?.explanation ?? "-"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="inherit" onClick={handleCloseDetail}>Tutup</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={deleteOpen} onClose={handleCloseDelete} fullWidth maxWidth="xs">
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2">
                Apakah Anda yakin ingin menghapus soal ini?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDelete} color="inherit">
                Batal
              </Button>
              <Button color="error" variant="contained" onClick={handleConfirmDelete}>
                Hapus
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};