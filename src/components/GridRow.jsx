import { Grid, Box, InputAdornment, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ArrowRightAlt } from "@mui/icons-material";

export default function GridRow({ rowId, lhs, rhs, handler }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "minmax(50px, 1fr) 50px minmax(50px, 1fr)",
                columnGap: "6px",                     
                alignItems: "center",
                width: "100%",                        
                minWidth: 0,                          
            }}
        >
            <TextField
                fullWidth
                size="small"
                margin="dense"
                value={lhs}
                onChange={(e) => handler(e, rowId, 0)}
            />
            <TextField
                fullWidth
                size="small"
                margin="dense"
                disabled
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <ArrowRightAlt />
                    </InputAdornment>
                ),
                }}
            />
            <TextField
                fullWidth
                size="small"
                margin="dense"
                value={rhs}
                onChange={(e) => handler(e, rowId, 1)}
            />
        </Box>
    );
};