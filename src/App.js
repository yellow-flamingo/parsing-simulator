import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack, Box, Paper, TextField, Typography, Button, Container, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight, Cancel, Forward, PlayArrow, Replay } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from 'react';
import './index.css';
import GridRow from "./GridRow";
import { cykParse } from "./cykParse";

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
  startIcon: {
    margin: 0
  }
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#652AD2',
    },
    secondary: {
      main: '#97E63C'
    },
  },
});

export default function App() {
  const classes = useStyles;

  const [items,setItems] = useState([]);
  const [grammar,setGrammar] = useState([<GridRow/>,<GridRow/>,<GridRow/>,<GridRow/>,<GridRow/>]);
  const [string,setString] = useState('');

  var cykGrid = [];

  const handleChange = (event) => {
    setString(event.target.value);
  }

  const handleClick =() => {
    cykGrid = cykParse(string);
    DrawGrid(cykGrid);
  }

  const handleClickTwo = () => {
    setGrammar([...grammar, <GridRow/>]);
  }

  function DrawGrid(grid) {
    var itemList = [];
    let identifier = 1;
    let row = 0;
    let cell = 0;
    for (var i=1; i<=string.length; i++) {
      itemList.push(<tr></tr>)
      cell = 0;
      for (var j=1; j<=i; j++) {
        let squareText = "";
        for (let k of grid[row][cell]) {
          squareText = squareText + k + ",";
        }
        if (squareText == "") {
          squareText = "-"
        } else {
          squareText = "{" + squareText.slice(0,-1) + "}";
        }
        itemList.push(<td key={i}><div class="square-table" id={identifier}>{squareText}</div></td>)
        identifier += 1;
        cell += 1;
      }
      row += 1;
    }
    itemList.push(<tr></tr>)
    for (let i=0; i<string.length; i++) {
      itemList.push(<td><div class="square-string" id={i}>{string[i]}</div></td>)
    }
    setItems([itemList]);
  }

  return (

    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Paper elevation={6} className={classes.paper}
              style={{ minHeight: "70vh", maxHeight: "70vh", padding: 8, overflow: "auto" }}>
                <Typography variant="h6" style={{ marginLeft: 8, marginTop: 8 }}>
                  Step 1: Enter your grammar
                </Typography>
                <Grid style={{ marginLeft: 8 }}>
                  {grammar}
                </Grid>
                <IconButton onClick={handleClickTwo} color="primary" style={{ marginBottom: 16 }}>
                  <AddCircleIcon />
                </IconButton>
                <Typography variant="h6" style={{ marginTop: 8, marginLeft: 8 }}>
                  Step 2: Enter string to parse
                </Typography>
                <TextField
                  placeholder="string"
                  margin="dense"
                  variant="outlined"
                  onChange={handleChange}
                  value={string}
                  size="small"
                  style={{ marginBottom: 24, marginLeft: 8 }}>
                </TextField>
                <Typography variant="h6" style={{ padding: 8 }}>
                  Step 3: Select Algorithm
                </Typography>
                <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                  Convert To CNF
                </Button>
                <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                  Convert To GNF
                </Button>                                
                <Button onClick={handleClick} variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                  CYK Parse
                </Button>
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper elevation={6} className={classes.paper}
              style={{ minHeight: "94.3vh", maxHeight: "94.3vh", padding: 8, overflow: "auto" }}>
                <Box display="inline">
                  <Box textAlign="center">
                    <Button variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginRight: 2 }} startIcon={<ArrowLeft style={{marginLeft: '10px'}} />}></Button>
                    <Button variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginLeft: 2 }} startIcon={<ArrowRight style={{marginLeft: '10px'}} />}></Button>
                    {/* <Button variant="contained" color="error" startIcon={<Cancel />} style={{ minHeight: '30px', maxHeight: '30px', marginTop: 8, marginLeft: 8 }}> Exit Visualization</Button> */}
                  </Box>
                </Box>
                  {/* <Button variant="contained" color="error" startIcon={<Cancel />} style={{ minHeight: '30px', maxHeight: '30px', marginTop: 8, marginRight: 8 }}> Exit Visualization</Button> */}
                  {/* <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
                    <Button variant="contained" color="primary" startIcon={<Cancel />} style={{ marginTop: 8, marginRight: 8 }}>
                      Exit Visualization
                    </Button>
                  </Box> */}
                {/* <Typography variant="h6" style={{ padding: 8 }}>
                  Step 1 - convert grammar to CNF:
                </Typography> */}
                <table id="cyk-table" style={{ padding: 8 }}>
                  {items}
                </table>
            </Paper>
          </Grid>
          {/* <Grid item xs={12}>
            <Paper elevation={6} className={classes.paper}
              style={{ minHeight: "30vh", maxHeight: "30vh", overflow: "auto" }}>
            </Paper>
          </Grid>         */}
        </Grid>
      </div>
    </ThemeProvider>
  );
}