import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Paper, TextField, Typography, Button,  IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight,  Opacity,  PlayArrow, SportsRugbySharp } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState, useRef } from 'react';
import Tree from 'react-d3-tree';
import './index.css';
import GridRow from "./GridRow";
import { cykParse } from "./cykParse";
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

const MyTreeComponent = () => {

  const treeData = {
    name: 'CEO',
    children: [
      {
        name: 'Manager',
        attributes: {
          department: 'Production',
        },
        children: [
          {
            name: 'Foreman',
            attributes: {
              department: 'Fabrication',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
          {
            name: 'Foreman',
            attributes: {
              department: 'Assembly',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
        ],
      },
    ],
  };

  return <Tree data={treeData} orientation="vertical" zoomable={false} draggable={false}/>
};

export default function App() {

  var currentId = 4;

  const handleLeftItem = (event, index) => {
    console.log(event.target.value);
    console.log(index);
    const newLeftItems = [...leftItems];
    newLeftItems[index] = event.target.value;
    setLeftItems(newLeftItems);
  }

  const handleRightItem = (event, index) => {
    const newRightItems = [...rightItems];
    newRightItems[index] = event.target.value;
    setRightItems(newRightItems);
  }  

  let cnfConversion = useRef();

  // For grammar input:
  // store array in state consisting of arrays of each 2 elements representing the LHS and RHS of a grammar production
  // map through this array in render and for each element create a GridRow component:
  // {grammarInput.map((row,index) =>
  //   <GridRow rowId={index} lhs={row[0]} rhs={row[1] handlerLeft={handleLeftItem} handlerRight={handleRightItem}}
  // )}
  // when the '+' button is clicked, a new pair list [0,0] is added to grammarInput
  // value={lhs} or value={rhs} inside the grid items in GridRow
  // (could probably get rid of handleLeftItem() and handleRightItem() and just update grammarInput whenever a letter is typed)

  const [items,setItems] = useState([]);
  const [grammarInput, setGrammarInput] = useState([['S','abAB'], ['A','bAB'], ['A',''], ['B','BAa'], ['B','']]);
  const [grammar,setGrammar] = useState([<GridRow rowId={0} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>,<GridRow rowId={1} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>,<GridRow rowId={2} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>,<GridRow rowId={3} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>,<GridRow rowId={4} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>]);
  const [string,setString] = useState('abbbb');
  const [cykTable,setCykTable] = useState([]);
  const [leftItems,setLeftItems] = useState(Array(grammar.length).fill(''));
  // const [leftItems,setLeftItems] = useState(['S', 'A', 'A', 'B', 'B']);
  const [rightItems,setRightItems] = useState(Array(grammar.length).fill(''));
  // const [rightItems,setRightItems] = useState(['abAB', 'bAB', '', 'BAa', '']);
  const [grammarSteps,setGrammarSteps] = useState([]);
  const [canGoBack,setCanGoBack] = useState(false);
  const [canGoForwards,setCanGoForwards] = useState(false);

  const [cnfRunning, setCnfRunning] = useState(false);
  const [cnfCurrentStep, setCnfCurrentStep] = useState(0);

  const [tableRunning, setTableRunning] = useState(false);
  const [tableCurrentStep, setTableCurrentStep] = useState(0);

  var currentId = 4;

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

  const handleClickParse =() => {
    setTableRunning(true);
    setCykTable(cykParse(string));
  }

  const handleClickPlus = () => {
    currentId += 1;
    setGrammar([...grammar, <GridRow rowId={currentId} handlerLeft={handleLeftItem} handlerRight={handleRightItem}/>]);
  }

  const handleClickCnf = () => {
    setCnfRunning(true);
    setCanGoForwards(true);
    setCnfCurrentStep(1);
    cnfConversion.current = convertToCNF();
    setGrammarSteps([JSON.parse(JSON.stringify(cnfConversion.current.next().value))]);
  }

  function nextCnf() {
    setCnfCurrentStep(cnfCurrentStep + 1);

    let nextStep = cnfConversion.current.next();

    if (cnfRunning) {
      if (nextStep.done) {
        setGrammarSteps([grammarSteps[grammarSteps.length-1]]);
        setCnfRunning(false);
        setTableRunning(true);
      } else {
        setGrammarSteps([...grammarSteps, JSON.parse(JSON.stringify(nextStep.value))]);
      }
    }    
  }

  const handleClickNext = () => {
    if (!canGoBack) {
      setCanGoBack(true);
    }

    if (cnfRunning) {
      nextCnf();
    } else if (tableRunning) {
      if (tableCurrentStep == 0) {
        setCykTable(cykParse(string));
        setTableCurrentStep(tableCurrentStep + 1);
      } else {
        setTableCurrentStep(tableCurrentStep + 1);
      }
    }
  }

  const handleClickPrevious = () => {
    if (cnfRunning) {

    } else if (tableRunning) {
      if (tableCurrentStep == 0) {
        setTableRunning(false);
        setCnfRunning(true);
      } else {
        setTableCurrentStep(tableCurrentStep - 1);
      }
    }
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
    if (tableRunning && cykTable.length > 0) {
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
        rowList = [];
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

          if (row == selectedRow) {
            if (cell == selectedColumn) {
              console.log(cell);
              console.log(selectedColumn);
              rowList.push(<td><div class="square-table-selected" id={identifier}>{squareText}</div></td>)
            } else if (cell == selectedColumn-1) {
              rowList.push(<td><div class="square-table-left-selected" id={identifier}>{squareText}</div></td>)
            } else if (cell == selectedColumn+1) {
              rowList.push(<td><div class="square-table-right-selected" id={identifier}>{squareText}</div></td>)
            } else {
              rowList.push(<td><div class="square-table" id={identifier}>{squareText}</div></td>)
            }

          } else if (cell == selectedColumn) {
            if (row == selectedRow-1) {
              rowList.push(<td><div class="square-table-above-selected" id={identifier}>{squareText}</div></td>)
            } else if (row == selectedRow+1) {
              rowList.push(<td><div class="square-table-below-selected" id={identifier}>{squareText}</div></td>)
            } else {
              rowList.push(<td><div class="square-table" id={identifier}>{squareText}</div></td>)
            }

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

      rowList = [];
      for (let i=0; i<string.length; i++) {
        if (selectedRow == string.length-1 && i == selectedColumn) {
          console.log("true");
          rowList.push(<td><div class="square-string-below-selected" id={i}>{string[i]}</div></td>)
        } else {
          rowList.push(<td><div class="square-string" id={i}>{string[i]}</div></td>)
        }
      }

      itemList.push(<tr>{rowList}</tr>)
      return itemList;
    }
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
                {grammar}
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
              <Button onClick={handleClickCnf} variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                Convert To CNF
              </Button>
              <Button variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                Convert To GNF
              </Button>                                
              <Button onClick={handleClickParse} variant="contained" color="primary" startIcon={<PlayArrow />} style={{ justifyContent: "flex-start", width: 214, marginBottom: 8, marginLeft: 8 }}>
                CYK Parse
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
                {grammarSteps.map(step =>
                  <div class="grammar-list-child">
                    {grammarExplanations[cnfCurrentStep-1]}
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
                <div class="tree-child">
                  <MyTreeComponent/>
                </div>
              </div>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}