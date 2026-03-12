import { useEffect, useMemo, useState } from "react";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import {
	Box,
	Button,
	CircularProgress,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router";

type DummyJson = {
	cpns?: Array<{
		title?: string;
		twk?: unknown[];
		tiu?: unknown[];
		tkp?: unknown[];
	}>;
};

type Counts = {
	twk: number;
	tiu: number;
	tkp: number;
};

export const Dashboard = () => {
	const [counts, setCounts] = useState<Counts>({ twk: 0, tiu: 0, tkp: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				setLoading(true);
				const response = await fetch("/dummy.json");
				if (!response.ok) {
					throw new Error("Gagal mengambil data JSON");
				}

				const data = (await response.json()) as DummyJson;
				const twkSection = data.cpns?.find((item) => item.title === "TWK");
				const tiuSection = data.cpns?.find((item) => item.title === "TIU");
				const tkpSection = data.cpns?.find((item) => item.title === "TKP");

				setCounts({
					twk: twkSection?.twk?.length ?? 0,
					tiu: tiuSection?.tiu?.length ?? 0,
					tkp: tkpSection?.tkp?.length ?? 0,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchCounts();
	}, []);

	const cards = useMemo(
		() => [
			{
				key: "TWK",
				icon: <PublicOutlinedIcon sx={{ fontSize: 34, color: "primary.main" }} />,
				count: counts.twk,
				path: "/banksoal/twk",
			},
			{
				key: "TIU",
				icon: <CalculateOutlinedIcon sx={{ fontSize: 34, color: "primary.main" }} />,
				count: counts.tiu,
				path: "/banksoal/tiu",
			},
			{
				key: "TKP",
				icon: <EmojiObjectsOutlinedIcon sx={{ fontSize: 34, color: "primary.main" }} />,
				count: counts.tkp,
				path: "/banksoal/tkp",
			},
		],
		[counts]
	);

	return (
		<Box sx={{ p: 4 }}>
			<Typography variant="h4" fontWeight={700} mb={1}>
				Bank Soal
			</Typography>
			<Typography variant="body1" color="text.secondary" mb={3}>
				Ringkasan kategori soal TWK, TIU, dan TKP beserta jumlah soal yang tersedia.
			</Typography>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
					<CircularProgress />
				</Box>
			) : (
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
						gap: 2,
					}}
				>
					{cards.map((item) => (
						<Paper key={item.key} sx={{ p: 2.5 }}>
							<Stack spacing={1.5}>
								{item.icon}
								<Typography variant="h6" fontWeight={700}>
									{item.key}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Jumlah soal: {item.count}
								</Typography>
								<Button
									component={RouterLink}
									to={item.path}
									variant="outlined"
									size="small"
									sx={{ alignSelf: "flex-start" }}
								>
									Lihat Halaman
								</Button>
							</Stack>
						</Paper>
					))}
				</Box>
			)}
		</Box>
	);
};
