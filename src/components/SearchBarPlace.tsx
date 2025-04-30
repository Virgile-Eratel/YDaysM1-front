import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import { DATE_FORMAT } from "../utils/dateConfig";

export const SearchBarPlace = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: 900,
                height: 100,
                border: "1px solid #0000FF",
                borderRadius: "9999px",
                px: 3,
                py: 2,
            }}
        >
            <TextField
                variant="outlined"
                label="Lieu"
                placeholder="Rechercher"
                sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
            />

            <div className={"h-14 mx-6 bg-gray-300 w-[1px]"}/>

            <DatePicker
                label="Date"
                format={DATE_FORMAT}
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
                sx={{
                    flex: 1,
                    paddingRight: 3,
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
            />

            <IconButton
                sx={{
                    backgroundColor: "#0000FF",
                    color: "#fff",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: "#0000CC",
                    },
                }}
            >
                <SearchIcon/>
            </IconButton>
        </Box>
    );
};