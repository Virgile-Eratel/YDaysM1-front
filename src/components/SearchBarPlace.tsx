import { useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DATE_FORMAT } from "../utils/dateConfig";
import { Dayjs } from "dayjs";

interface SearchBarPlaceProps {
    onSearch: (results: {
        location: string | undefined;
        date: Dayjs | null;
        time: Dayjs | null;
        guests: number | null
    }) => void;
    loading?: boolean;
}

export const SearchBarPlace = ({ onSearch, loading = false }: SearchBarPlaceProps) => {
    const [location, setLocation] = useState<string>("");
    const [date, setDate] = useState<Dayjs | null>(null);
    const [time, setTime] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState<number | null>(null);

    const handleSearch = () => {
        // Créer un objet avec les paramètres de recherche
        const searchParams = {
            location: location.trim() !== "" ? location : undefined,
            date: date,
            time: time,
            guests: guests
        };

        // Appeler la fonction de recherche fournie par le parent
        onSearch(searchParams);
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: 900,
                height: 100,
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: "9999px",
                px: 3,
                py: 2,
            }}
        >
            <TextField
                variant="outlined"
                label="Lieu"
                placeholder="Rechercher"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
            />

            <div className={"h-14 mx-6 bg-gray-300 w-[1px]"}/>

            <DatePicker
                label="Date"
                format={DATE_FORMAT}
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slots={{ textField: TextField }}
                slotProps={{
                    textField: {
                        variant: "outlined",
                        sx: {
                            flex: 1,
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none !important" },
                        },
                    },
                }}
            />

            <div className={"h-14 mx-6 bg-gray-300 w-[1px]"}/>

            <TimePicker
                label="Horaire"
                format="HH:mm"
                ampm={false}
                value={time}
                onChange={(newValue) => setTime(newValue)}
                slots={{ textField: TextField }}
                slotProps={{
                    textField: {
                        variant: "outlined",
                        sx: {
                            flex: 1,
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                        },
                    },
                }}
            />
            <div className={"h-14 mx-6 bg-gray-300 w-[1px]"}/>

            <TextField
                variant="outlined"
                label="Personnes"
                type={"number"}
                value={guests === null ? "" : guests}
                onChange={(e) => setGuests(e.target.value ? parseInt(e.target.value) : null)}
                inputProps={{ min: 1 }}
                sx={{
                    flex: 1,
                    paddingRight: 3,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
            />

            <IconButton
                onClick={handleSearch}
                disabled={loading}
                color="primary"
                sx={{
                    backgroundColor: "primary.main",
                    color: "#fff",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: "primary.dark",
                    },
                }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
            </IconButton>
        </Box>
    );
};