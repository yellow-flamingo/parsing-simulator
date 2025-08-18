import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Paper, TextField, Typography, Button,  IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight,  ConstructionOutlined,  Opacity,  PlayArrow, SportsRugbySharp } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import './index.css';
import GridRow from "./components/GridRow";
import { cykParse, getExplanations } from "./algorithms/cykParse";
import { convertToCNF } from "./algorithms/convertToCNF";
import { cykParseBackpointers, buildParseTree } from "./algorithms/buildParseTree";

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

  let cnfConversion = useRef();
  let tableExplanations = useRef();

  const [grammarInput, setGrammarInput] = useState([['S','abAB'], ['A','bAB'], ['A',''], ['B','BAa'], ['B','']]);
  const [inputString, setInputString] = useState('abbbb');
  const [string,setString] = useState('abbbb');
  const [cykTable,setCykTable] = useState([]);
  const [canGoBack,setCanGoBack] = useState(false);
  const [canGoForwards,setCanGoForwards] = useState(false);

  const [cnfRunning, setCnfRunning] = useState(false);
  let cnfStep = useRef(0);

  const [tableRunning, setTableRunning] = useState(false);
  const [tableCurrentStep, setTableCurrentStep] = useState(0);

  const [resultRunning, setResultRunning] = useState(false);

  const [treeRunning, setTreeRunning] = useState(false);

  const [betweenRunning, setBetweenRunning] = useState(false);
  const [betweenRunningTwo, setBetweenRunningTwo] = useState(false);

  const [grammarSteps,setGrammarSteps] = useState([]);
  const [grammarStepsHistory, setGrammarStepsHistory] = useState([]);

  const [tableDataHistory, setTableDataHistory] = useState([]);

  const [cnfFinished, setCnfFinished] = useState(false);

  const grammarExplanations = [
    "Step 1 - remove S from RHS:",
    "Step 2 - remove lambda productions:",
    "Step 3 - remove unit productions:",
    "Step 4 - reduce to two symbols:",
    "Step 5 - separate terminals from non-terminals:",
    "Grammar in CNF:"
  ]

  const handleChangeString = (event) => {
    setInputString(event.target.value);
  }

  const handleGrammarInput = (event, row, side) => {
    const newGrammar = [...grammarInput];
    newGrammar[row][side] = event.target.value;
    setGrammarInput(newGrammar);
  }

  const handleClickParse =() => {
    setTableRunning(false);
    setTreeRunning(false);
    setResultRunning(false);
    setTableCurrentStep(0);
    setBetweenRunning(false);
    setBetweenRunningTwo(false);
    setCnfFinished(false);
    setGrammarSteps([]);
    setGrammarStepsHistory([]);
    setTableDataHistory([]);
    tableExplanations.current = null;
    cnfStep.current = 0;
    setCnfRunning(true);
    setCanGoForwards(true);
    setCanGoBack(false);
    setString(inputString);
    cnfConversion.current = convertToCNF(convertGrammarInput());
    let nextStep = cnfConversion.current.next();
    setGrammarStepsHistory([[JSON.parse(JSON.stringify(nextStep.value))]]);
    setGrammarSteps([JSON.parse(JSON.stringify(nextStep.value))]);
    cnfStep.current += 1;
  }

  const handleClickPlus = () => {
    setGrammarInput([...grammarInput, ['','']])
  }

  function convertGrammarInput() {
    let grammar = {};
    for (let rule of grammarInput) {
      if (rule[0] != '') {
        if (Object.keys(grammar).includes(rule[0]) && !(grammar[rule[0]].includes(rule[1]))) {
          grammar[rule[0]].push(rule[1]);
        } else {
          grammar[rule[0]] = [rule[1]];
        }        
      }
    }
    return grammar;
  }

  function nextCnf() {
    if (cnfStep.current >= grammarStepsHistory.length) {
      let nextStep = cnfConversion.current.next();

      if (nextStep.done) {
        if (cnfFinished == false) {
          setGrammarStepsHistory([...grammarStepsHistory, [grammarSteps[grammarSteps.length-1]]]);
          setGrammarSteps([grammarSteps[grammarSteps.length-1]]);    
          setCnfFinished(true);
          setCnfRunning(false);
          setBetweenRunning(true);                                   
        }
      } else {
        setGrammarStepsHistory([...grammarStepsHistory, [...grammarSteps, JSON.parse(JSON.stringify(nextStep.value))]]);
        setGrammarSteps([...grammarSteps, JSON.parse(JSON.stringify(nextStep.value))]);     
      }

    } else {
      if (grammarStepsHistory.length == 6 && cnfStep.current == 5) {
        setCnfRunning(false);
        setBetweenRunning(true);        
      }
      setGrammarSteps(grammarStepsHistory[cnfStep.current]);
    }
    cnfStep.current += 1;
  }

  function nextTable() {
    if (tableCurrentStep == 0) {
      setCykTable(cykParse(string, grammarSteps[grammarSteps.length-1]));
    } else {
      if (tableCurrentStep === 1 && !tableExplanations.current) {
        tableExplanations.current = getExplanations(string, grammarSteps[grammarSteps.length-1], cykTable);
      }
      if (tableCurrentStep > tableDataHistory.length) {
        let nextStep = tableExplanations.current.next()
        if (nextStep.done) {
          setTableRunning(false);
          setResultRunning(true);
        }
        setTableDataHistory([...tableDataHistory, JSON.parse(JSON.stringify(nextStep.value))]);
      }
    }
    setTableCurrentStep(tableCurrentStep + 1);
  }

  const handleClickNext = () => {
    if (!canGoBack) {
      setCanGoBack(true);
    }

    if (cnfRunning) {
      nextCnf();
    } else if (tableRunning) {
      nextTable();
    } else if (betweenRunning) {
      setCykTable(cykParse(string, grammarSteps[grammarSteps.length-1]));
      setBetweenRunning(false);
      setTableRunning(true);
      setTableCurrentStep(tableCurrentStep + 1);
    } else if (resultRunning) {
      setResultRunning(false);
      setTreeRunning(true);
      setCanGoForwards(false);
    }
  }

  const handleClickPrevious = () => {
    if (cnfRunning && cnfStep.current > 1) {
      cnfStep.current -= 1;
      setGrammarSteps(grammarStepsHistory[cnfStep.current-1]);
    } else if (tableRunning) {
      if (tableCurrentStep == 1) {
        setTableRunning(false);
        setBetweenRunning(true);
        setTableCurrentStep(tableCurrentStep - 1);
      } else {
        setTableCurrentStep(tableCurrentStep - 1);
      }
    } else if (betweenRunning) {
      cnfStep.current -= 1;
      setGrammarSteps(grammarStepsHistory[cnfStep.current-1]);
      setBetweenRunning(false);
      setCnfRunning(true);      
    } else if (treeRunning) {
      setTreeRunning(false);
      setResultRunning(true);
      setCanGoForwards(true);
    } else if (resultRunning) {
      setResultRunning(false);
      setTableRunning(true);
    } else {
      setCanGoBack(false);
    }
  }

  function displayGrammarList(grammar) {
    let grammarList = [];
    let listItem;
    for (let key in grammar) {
      let rightSide = "";
      for (let item of grammar[key]) {
        if (item == '') {
          rightSide += 'lambda' + ' | ';
        } else {
          rightSide += item + ' | ';
        }
      }

      rightSide = rightSide.slice(0,-3);
  
      listItem = <li>{key} &#8594; {rightSide}</li>
      grammarList.push(listItem);
    }

    return <ul class="grammar-list">{grammarList}</ul>;
  }

  function drawParseTable() {
    if ((tableRunning && cykTable.length > 0 && tableCurrentStep > 0) || resultRunning || betweenRunningTwo || treeRunning) {
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

          if (row == selectedRow && cell == selectedColumn && tableRunning) {
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
            if (string1.length > 1) {
              string1 = string1.slice(0,-1) + '}';
            } else {
              string1 += '}';
            }
            
            for (let elem of data.nonterminals[i][1]) {
              string2 = string2 + elem + ',';
            }
            if (string2.length > 1) {
              string2 = string2.slice(0,-1) + '}';
            } else {
              string2 += '}';
            }
  
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

  function isAccepted() {
    if (Object.keys(grammarSteps[0]).includes('S0')) {
      if (cykTable[0][0].includes('S0')) {
        return true
      }
    } else {
      if (cykTable[0][0].includes('S')) {
        return true
      }
    }
    return false
  }

  function displayResult() {
    if (resultRunning || treeRunning) {
      if (isAccepted()) {
        return "The string '" + string + "' is accepted"
      } else {
        return "The string '" + string + "' is not accepted"
      }
    }
  }

  function displayParseTree() {
    if (treeRunning && isAccepted()) {
      const backpointers = cykParseBackpointers(string, grammarSteps[[0]]);
      var tree = (buildParseTree(backpointers[string][Object.keys(grammarSteps[0]).includes('S0') ? 'S0' : 'S'])).replaceAll(',]',']');

      if (tree[tree.length-1] == ',') {
        tree = tree.slice(0,-1);
      }

      const treeData = JSON.parse(tree);

      return <Tree data={treeData} orientation="vertical" zoomable={false} draggable={true}/>
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Paper elevation={6} height={1200}
            style={{ minHeight: "60vh", maxHeight: "60vh", padding: 8, overflow: "auto", border: "2px solid #652AD2" }}>
              <Typography variant="h6" style={{ marginLeft: 8, marginTop: 8 }}>
                Step 1: Enter your grammar
              </Typography>
              <Grid style={{ marginLeft: 8, marginRight: 8 }}>
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
                value={inputString}
                size="small"
                style={{ marginBottom: 24, marginLeft: 8 }}>
              </TextField>
              <Typography variant="h6" style={{ padding: 8 }}>
                Step 3: Start Visualisation
              </Typography>
              <Button onClick={handleClickParse} variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 150, marginBottom: 8, marginLeft: 8 }}>
                CYK Parse
              </Button>                             
          </Paper>
          <p class="editor-rules">
            Start symbol must be 'S'. <br/><br/>
            Each production rule must be written on a separate line.<br/>
            e.g. S &#8594; B | C must be written as two separate rules:<br/>
            S &#8594; B<br/>
            S &#8594; C<br/><br/>
            Please Note: this tool currently only supports the parsing of strings of single characters. <br/>
            If you wish to enter a more complex grammar / string e.g. a full english sentence, the visualisation will not be accurate.
          </p>
        </Grid>
        <Grid item xs={10}>
          <Paper elevation = {6} height={1200}
            style={{ minHeight: "94.3vh", maxHeight: "94.3vh", padding: 8, overflow: "auto", border: "2px solid #652AD2" }}>
              <Box display="inline">
                <Box textAlign="center">
                  <Button onClick = {handleClickPrevious} disabled={!canGoBack} variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginRight: 2 }} startIcon={<ArrowLeft style={{marginLeft: '10px'}} />}></Button>
                  <Button onClick = {handleClickNext} disabled={!canGoForwards} variant="contained" color="primary" style={{ minWidth: '30px', maxWidth: '30px', maxHeight: '30px', marginTop: 8, marginLeft: 2 }} startIcon={<ArrowRight style={{marginLeft: '10px'}} />}></Button>
                </Box>
              </Box>
              <div class="main-parent">
                {grammarSteps.map((step,index) =>
                  <div class="grammar-list-main">
                    <div class="grammar-list-title">
                      {grammarExplanations[cnfStep.current < 6 ? index : 5]}
                    </div>
                    <div class="grammar-list-child">
                      {displayGrammarList(step)}
                    </div>
                  </div>
                )}
                <div class="table-child">
                  <table id="cyk-table" style={{ padding: 8 }}>
                    <tbody>
                      {drawParseTable()}
                    </tbody>
                  </table>
                  <div class="result">
                  {displayResult()}
                  </div>
                </div>
                <div class="explanations">
                  <ul class="explanations-child">
                    {displayExplanations()}
                  </ul>
                </div>
                <div class="tree-child">
                  {displayParseTree()}
                </div>
              </div>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}