import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Paper, TextField, Typography, Button,  IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight,  ConstructionOutlined,  Opacity,  PlayArrow, SportsRugbySharp } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import './index.css';
import GridRow from "./GridRow";
import { cykParse, getExplanations } from "./cykParse";
import { convertToCNF } from "./convertToCNF";

const theme = createTheme({
  palette: {
    primary: {
      main: '#652AD2',
    },
    secondary: {
      main: '#97E63C'
    },
    // action: {
    //   disabledBackground: rgba(101,42,210,0.5)
    // }
  },
});

export default function App() {

  let cnfConversion = useRef();
  let tableExplanations = useRef();

  const [items,setItems] = useState([]);
  const [grammarInput, setGrammarInput] = useState([['S','abAB'], ['A','bAB'], ['A',''], ['B','BAa'], ['B','']]);
  const [string,setString] = useState('abbbb');
  const [cykTable,setCykTable] = useState([]);
  const [grammarSteps,setGrammarSteps] = useState([]);
  const [canGoBack,setCanGoBack] = useState(false);
  const [canGoForwards,setCanGoForwards] = useState(false);

  const [cnfRunning, setCnfRunning] = useState(false);
  const [cnfCurrentStep, setCnfCurrentStep] = useState(0);
  let cnfStep = useRef(0);

  const [tableRunning, setTableRunning] = useState(false);
  const [tableCurrentStep, setTableCurrentStep] = useState(0);

  const [grammarStepsHistory, setGrammarStepsHistory] = useState([]);
  const [tableDataHistory, setTableDataHistory] = useState([]);

  const grammarExplanations = [
    "Step 1 - remove lambda productions:",
    "Step 2 - remove unit productions:",
    "Step 3 - reduce to two symbols:",
    "Step 4 - separate terminals from non-terminals:",
    "Grammar in CNF:"
  ]

  const handleChangeString = (event) => {
    setString(event.target.value);
  }

  const handleGrammarInput = (event, row, side) => {
    const newGrammar = [...grammarInput];
    newGrammar[row][side] = event.target.value;
    setGrammarInput(newGrammar);
  }

  const handleClickParse =() => {
    setCnfRunning(true);
    setCanGoForwards(true);
    cnfConversion.current = convertToCNF(convertGrammarInput());
    let nextStep = cnfConversion.current.next();
    setGrammarStepsHistory([[JSON.parse(JSON.stringify(nextStep.value))]]);
    setGrammarSteps([JSON.parse(JSON.stringify(nextStep.value))]);
    setCnfCurrentStep(cnfCurrentStep + 1);
    cnfStep.current += 1;
    console.log(cnfStep.current);
  }

  const handleClickPlus = () => {
    setGrammarInput([...grammarInput, ['','']])
  }

  function convertGrammarInput() {
    let grammar = {};
    for (let rule of grammarInput) {
      if (Object.keys(grammar).includes(rule[0])) {
        grammar[rule[0]].push(rule[1]);
      } else {
        grammar[rule[0]] = [rule[1]];
      }
    }
    return grammar;
  }


  function nextCnf() {
    if (cnfStep.current >= grammarStepsHistory.length) {
      let nextStep = cnfConversion.current.next();

      if (cnfRunning) {
        if (nextStep.done) {
          setGrammarStepsHistory([...grammarStepsHistory, [grammarSteps[grammarSteps.length-1]]]);
          setGrammarSteps([grammarSteps[grammarSteps.length-1]]);
          setCnfRunning(false);
          setTableRunning(true);
        } else {
          setGrammarStepsHistory([...grammarStepsHistory, [...grammarSteps, JSON.parse(JSON.stringify(nextStep.value))]]);
          setGrammarSteps([...grammarSteps, JSON.parse(JSON.stringify(nextStep.value))]);
        }
      } 
    } else {
      if (cnfStep.current == grammarStepsHistory.length-1) {
        setGrammarSteps(grammarStepsHistory[cnfStep.current]);
        setCnfRunning(false);
        setTableRunning(true);
      } else {
        setGrammarSteps(grammarStepsHistory[cnfStep.current]);
      }
    }
    
    setCnfCurrentStep(cnfCurrentStep + 1);
    cnfStep.current += 1;
  }

  const handleClickNext = () => {
    if (!canGoBack) {
      setCanGoBack(true);
    }

    if (cnfRunning) {
      console.log("CNF running");
      nextCnf();
    } else if (tableRunning) {
      if (tableCurrentStep == 0) {
        setCykTable(cykParse(string, grammarSteps[grammarSteps.length-1]));
      } else {
        if (tableCurrentStep === 1 && !tableExplanations.current) {
          tableExplanations.current = getExplanations(string, grammarSteps[grammarSteps.length-1], cykTable);
        }
        if (tableCurrentStep > tableDataHistory.length) {
          let nextStep = tableExplanations.current.next().value;
          setTableDataHistory([...tableDataHistory, JSON.parse(JSON.stringify(nextStep))]);
        }
      }
      setTableCurrentStep(tableCurrentStep + 1);
    }
    console.log(cnfStep.current);
  }

  const handleClickPrevious = () => {
    if (cnfRunning && cnfStep.current > 1) {
      console.log("true");
      setCnfCurrentStep(cnfCurrentStep - 1);
      cnfStep.current -= 1;
      setGrammarSteps(grammarStepsHistory[cnfCurrentStep-2]);
    } else if (tableRunning) {
      if (tableCurrentStep == 1) {
        setTableRunning(false);
        setCnfRunning(true);
        setTableCurrentStep(tableCurrentStep - 1);
      } else {
        setTableCurrentStep(tableCurrentStep - 1);
      }
    } else {
      setCanGoBack(false);
    }

    console.log(cnfStep.current);
  }

  function displayGrammarList(grammar) {
    let grammarList = [];
    let listItem;
    for (let key in grammar) {
      let rightSide = "";
      for (let item of grammar[key]) {
        rightSide += item + ' | '
      }
      rightSide = rightSide.slice(0,-3);
  
      listItem = <li>{key} &#8594; {rightSide}</li>
      grammarList.push(listItem);
    }

    return <ul class="grammar-list">{grammarList}</ul>;
  }

  function drawParseTable() {
    if (tableRunning && cykTable.length > 0 && tableCurrentStep > 0) {
      let rowList;
      let itemList = [];
      let squareText = "";
      let identifier = 1;
      let row = 0;
      let cell = 0;
      let numOfCells = 0;
      let cellId;
      let subtractor = 0;
      let selectedRow;
      let selectedColumn;

      for (let a=string.length; a > 0; a--) {
        numOfCells += a;
      }

      for (let r=0; r<string.length; r++) {
        for (let c=0; c<=r; c++) {
          cellId = numOfCells - r - subtractor - (r - c);
          if (cellId == tableCurrentStep-1) {
            selectedRow = r;
            selectedColumn = c;
          }
        }
        subtractor += r;
      }

      subtractor = 0;
      for (let i=1; i<=string.length; i++) {
        rowList = [<td><div class="square-index">{(string.length-1)-row}</div></td>];
        cell = 0;
        for (let j=1; j<=i; j++) {
          cellId = numOfCells - row - subtractor - (row - cell);

          squareText = "";
          if (cellId <= tableCurrentStep-1) {
            for (let k of cykTable[row][cell]) {
              squareText = squareText + k + ",";
            }
            if (squareText === "") {
              squareText = "-"
            } else {
              squareText = "{" + squareText.slice(0,-1) + "}";
            }            
          }

          if (row == selectedRow && cell == selectedColumn) {
            rowList.push(<td><div class="square-table-selected" id={identifier}>{squareText}</div></td>)
          } else {
            rowList.push(<td><div class="square-table" id={identifier}>{squareText}</div></td>)
          }

          identifier += 1;
          cell += 1;
        }

        itemList.push(<tr>{rowList}</tr>)
        subtractor += row;
        row += 1;
      }

      rowList = [<td><div class="square-string"></div></td>];
      for (let i=0; i<string.length; i++) {
        if (selectedRow == string.length-1 && i == selectedColumn) {
          rowList.push(<td><div class="square-string" id={i}>{string[i]}</div></td>)
        } else {
          rowList.push(<td><div class="square-string" id={i}>{string[i]}</div></td>)
        }
      }

      itemList.push(<tr>{rowList}</tr>)
      return itemList;
    }
  }
  
  function displayExplanations() {
    if (tableRunning && tableCurrentStep > 1) {
      var data = tableDataHistory[tableCurrentStep-2];
      var explList = [];

      explList.push(<li>substring {data.substring}:</li>)

      if (data.substring.length === 1) {
        for (let nonterminal of data.nonterminals[0][0]) {
          explList.push(<li class="bold">&nbsp; {nonterminal} &#8594; {data.substring}</li>)
        }
      } else {
        for (let i=0; i<data.combinations.length; i++) {
          let item = data.combinations[i];
          if (item.length == 1) {
            explList.push(<li>&nbsp; {item[0]}</li>)
          } else {
            explList.push(<li>&nbsp; {item[0]}, {item[1]}:</li>)
  
            let string1 = '{';
            let string2 = '{';
            for (let elem of data.nonterminals[i][0]) {
              string1 = string1 + elem + ',';
            }
            string1 = string1.slice(0,-1) + '}';
            
            for (let elem of data.nonterminals[i][1]) {
              string2 = string2 + elem + ',';
            }
            string2 = string2.slice(0,-1) + '}';
  
            explList.push(<li>&nbsp; &nbsp; {string1} X {string2}</li>)
  
            let interString = '';
            for (let pair of data.products[i]) {
              interString = interString + pair + ', ';
            }
            explList.push(<li>&nbsp; &nbsp; {interString.slice(0,-2)}</li>)
            for (let prod of data.productions[i]) {
              explList.push(<li class="bold">&nbsp; &nbsp; {prod[0]} &#8594; {prod[1]}</li>)
            }
          }
        }
      }
    }

    return <ul class="explanations-child">{explList}</ul>
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Paper elevation={6} height={1200}
            style={{ minHeight: "70vh", maxHeight: "70vh", padding: 8, overflow: "auto" }}>
              <Typography variant="h6" style={{ marginLeft: 8, marginTop: 8 }}>
                Step 1: Enter your grammar
              </Typography>
              <Grid style={{ marginLeft: 8 }}>
                {grammarInput.map((row,index) => 
                  <GridRow rowId={index} lhs={row[0]} rhs={row[1]} handler={handleGrammarInput}></GridRow>
                )}
              </Grid>
              <IconButton onClick={handleClickPlus} color="primary" style={{ marginBottom: 16 }}>
                <AddCircleIcon />
              </IconButton>
              <Typography variant="h6" style={{ marginTop: 8, marginLeft: 8 }}>
                Step 2: Enter string to parse
              </Typography>
              <TextField
                placeholder="string"
                margin="dense"
                variant="outlined"
                onChange={handleChangeString}
                value={string}
                size="small"
                style={{ marginBottom: 24, marginLeft: 8 }}>
              </TextField>
              <Typography variant="h6" style={{ padding: 8 }}>
                Step 3: Select Algorithm
              </Typography>
              <Button onClick={handleClickParse} variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                CYK Parse
              </Button>              
              <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                Convert To CNF
              </Button>
              <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                Convert To GNF
              </Button>                                
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper elevation={6} height={1200}
            style={{ minHeight: "94.3vh", maxHeight: "94.3vh", padding: 8, overflow: "auto" }}>
              <Box display="inline">
                <Box textAlign="center">
                  <Button onClick = {handleClickPrevious} disabled={!canGoBack} variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginRight: 2 }} startIcon={<ArrowLeft style={{marginLeft: '10px'}} />}></Button>
                  <Button onClick = {handleClickNext} disabled={!canGoForwards} variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginLeft: 2 }} startIcon={<ArrowRight style={{marginLeft: '10px'}} />}></Button>
                </Box>
              </Box>
              <div class="main-parent">
                {grammarSteps.map((step,index) =>
                  <div class="grammar-list-child">
                    {grammarExplanations[index]}
                    {displayGrammarList(step)}
                  </div>
                )}
                <div class="table-child">
                  <table id="cyk-table" style={{ padding: 8 }}>
                    <tbody>
                      {drawParseTable()}
                    </tbody>
                  </table>
                </div>
                <div class="explanations">
                  <ul class="explanations-child">
                    {displayExplanations()}
                  </ul>
                </div>
              </div>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}