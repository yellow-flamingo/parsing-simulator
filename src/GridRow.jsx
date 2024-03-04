import { Grid, InputAdornment, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ArrowRightAlt } from "@mui/icons-material";

export default function GridRow() {
    return (
        <Grid container spacing={1}>
            <Grid item xs={4.4}>
                <TextField
                    placeholder="LHS"
                    margin="dense"
                    size="small">
                </TextField>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    // sx={{input: {textAlign: "center"}}}
                    margin="dense"
                    size="small"
                    disabled={true}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ArrowRightAlt />
                            </InputAdornment>
                        )
                    }}>
                </TextField>
            </Grid>
            <Grid item xs={4.4}>
                <TextField
                    placeholder="RHS"
                    margin="dense"
                    size="small">
                </TextField>
            </Grid>
        </Grid>
    );
};