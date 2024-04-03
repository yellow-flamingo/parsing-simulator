import { Grid, InputAdornment, TextField } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { ArrowRightAlt } from "@mui/icons-material";

export default function GridRow({ rowId, lhs, rhs, handler }) {
    return (
        <Grid container spacing={1}>
            <Grid item xs={4.4}>
                <TextField
                    margin="dense"
                    size="small"
                    onChange = {(event) => handler(event,rowId,0)}
                    value={lhs}>
                </TextField>
            </Grid>
            <Grid item xs={3}>
                <TextField
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
                    margin="dense"
                    size="small"
                    onChange = {(event) => handler(event,rowId,1)}
                    value={rhs}>
                </TextField>
            </Grid>
        </Grid>
    );
};