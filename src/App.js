import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { Stack, Box, Paper, TextField, Typography, AppBar, Button, IconButton, Container } from "@mui/material";
import { Cancel, Forward, PlayArrow, Replay } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
  field: {
    marginTop: 10,
    marginBottom: 10,
  },
  root: {
    margin: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit,
    height: "1200"
  },
}));

export default function App() {
  const classes = useStyles;

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Paper elevation={6} className={classes.paper}
            style={{ minHeight: "70vh", maxHeight: "70vh", padding: 8, overflow: "auto" }}>
              <Typography variant="h6" style={{ padding: 8 }}>
                Step 1: Enter your grammar
              </Typography>
              <Grid container spacing={0} style={{ padding: 8 }}>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense"
                    autoFocus>
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    defaultValue="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    defaultValue="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    defaultValue="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    defaultValue="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    value="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    value="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    value="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="LHS"
                    margin="dense">
                  </TextField>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    disabled={true}
                    value="->">
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    placeholder="RHS"
                    margin="dense">
                  </TextField>
                </Grid> 
              </Grid>
              <Typography variant="h6" style={{ padding: 8 }}>
                Step 2: Enter string to parse
              </Typography>
              <TextField
                placeholder="string"
                margin="dense"
                variant="outlined"
                style={{ padding: 8 }}>
              </TextField>
              <Typography variant="h6" style={{ padding: 8 }}>
                Step 3: Select Algorithm
              </Typography>
              <Box>
                <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ marginBottom: 8, marginLeft: 8 }}>
                  CYK Parse
                </Button>
              </Box>
              <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ marginLeft: 8 }}>
                Convert to PDA
              </Button>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper elevation={6} className={classes.paper}
            style={{ minHeight: "70vh", maxHeight: "70vh", padding: 8, overflow: "auto" }}>
              <div>
                <Box textAlign="center">
                  <Button variant="contained" color="primary" startIcon={<Replay />} style={{ marginTop: 8, marginRight: 2 }}></Button>
                  <Button variant="contained" color="primary" startIcon={<Forward />} style={{ marginTop: 8, marginLeft: 2 }}></Button>
                  <Button variant="contained" color="primary" startIcon={<Cancel />} style={{ marginTop: 8, marginLeft: 8 }}> Exit Visualization</Button>
                </Box>
                {/* <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                  <Button variant="contained" color="primary" startIcon={<Cancel />} style={{ marginTop: 8, marginRight: 8 }}>
                    Exit Visualization
                  </Button>
                </Box> */}
              </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={6} className={classes.paper}
            style={{ minHeight: "30vh", maxHeight: "30vh", overflow: "auto" }}>
          </Paper>
        </Grid>        
      </Grid>
    </div>
  );
}