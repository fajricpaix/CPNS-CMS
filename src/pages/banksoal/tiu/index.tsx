import { useEffect, useMemo, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type TIUQuestion = {
  answer?: string;
  explanation?: string;
  options?: Array<{ label?: string; text?: string }>;
  question?: { text?: string } | string;
};

type DummyJson = {
  cpns?: Array<{
    title?: string;
    tiu?: TIUQuestion[];
  }>;
};

const INITIAL_LOAD = 15;
const LOAD_MORE = 10;

export const TIUPage = () => {
  const [questions, setQuestions] = useState<TIUQuestion[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<TIUQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTiuQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/dummy.json");
        if (!response.ok) {
          throw new Error("Gagal mengambil data JSON");
        }

        const data = (await response.json()) as DummyJson;
        const tiuSection = data.cpns?.find((item) => item.title === "TIU");
        setQuestions(tiuSection?.tiu ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchTiuQuestions();
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

  const getQuestionText = (question: TIUQuestion["question"]) => {
    if (!question) {
      return "-";
    }

    if (typeof question === "string") {
      return question;
    }

    return question.text ?? "-";
  };

  const handleAdd = () => {
    alert("Tambah soal belum diimplementasikan.");
  };

  const handleEdit = (index: number) => {
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
          Bank Soal TIU
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
                  <TableCell sx={{ width: 50, fontWeight: 700 }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Soal</TableCell>
                  <TableCell sx={{ width: 100, fontWeight: 700 }}>Jawaban</TableCell>
                  <TableCell align="center" sx={{ width: 120, fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
                </TableHead>
              <TableBody>
                {visibleQuestions.map((item, index) => (
                  <TableRow key={`tiu-${index}`} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{getQuestionText(item.question)}</TableCell>
                    <TableCell align="center">{item.answer ?? "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleEdit(index)}>
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

          <Dialog
            open={detailOpen}
            onClose={handleCloseDetail}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              Soal TIU {selectedIndex !== null ? `No. ${selectedIndex + 1}` : ""}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Soal
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getQuestionText(selectedQuestion?.question)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pilihan Jawaban
              </Typography>
              {selectedQuestion?.options?.length ? (
                <List dense sx={{ pt: 0, mb: 2 }}>
                  {selectedQuestion.options.map((option, optionIndex) => (
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
                {selectedQuestion?.answer ?? "-"}
              </Typography>

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