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
                display: { xs: "flex", sm: "flex" },
                flexDirection: { xs: "column", sm: "column", md: "row" },
                alignItems: "center",
                width: { xs: "95%", sm: "95%", md: 900 },
                maxWidth: "95%",
                height: { xs: "auto", sm: "auto", md: 100 },
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: { xs: "24px", sm: "24px", md: "9999px" },
                px: { xs: 2, sm: 2, md: 3 },
                py: { xs: 3, sm: 3, md: 2 },
                gap: { xs: 2, sm: 2, md: 0 },
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
                    width: { xs: "100%", md: "auto" },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
            />

            <div className={"h-14 mx-6 bg-gray-300 w-[1px] hidden md:block"}/>
            <div className={"h-[1px] w-full bg-gray-300 block md:hidden"}/>

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
                            width: { xs: "100%", md: "auto" },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none !important" },
                        },
                    },
                }}
            />

            <div className={"h-14 mx-6 bg-gray-300 w-[1px] hidden md:block"}/>
            <div className={"h-[1px] w-full bg-gray-300 block md:hidden"}/>

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
                            width: { xs: "100%", md: "auto" },
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                        },
                    },
                }}
            />
            <div className={"h-14 mx-6 bg-gray-300 w-[1px] hidden md:block"}/>
            <div className={"h-[1px] w-full bg-gray-300 block md:hidden"}/>

            <TextField
                variant="outlined"
                label="Personnes"
                type={"number"}
                value={guests === null ? "" : guests}
                onChange={(e) => setGuests(e.target.value ? parseInt(e.target.value) : null)}
                inputProps={{ min: 1 }}
                sx={{
                    flex: 1,
                    width: { xs: "100%", md: "auto" },
                    paddingRight: { xs: 0, md: 3 },
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
                    width: { xs: "100%", md: 48 },
                    height: 48,
                    borderRadius: { xs: "24px", md: "50%" },
                    mt: { xs: 2, md: 0 },
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