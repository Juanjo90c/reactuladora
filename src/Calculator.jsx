import { useState, useEffect } from 'react'
import './styles.css'
import Button from './Button'


const Calculator = () => {

  const [dispSup, setDispSup] = useState("")
  const [dispInf, setDispInf] = useState("0")
  const [decimalUsed, setDecimalUsed] = useState(false)
  const [newOperation, setNewOperation] = useState(false)
  const [operation, setOperation] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyMappings = {
        '0': '0', 
        '1': '1', 
        '2': '2', 
        '3': '3', 
        '4': '4',
        '5': '5', 
        '6': '6', 
        '7': '7', 
        '8': '8', 
        '9': '9',
        '+': '+', 
        '-': '-', 
        '*': 'x', 
        '/': '÷',
        '.': '.', 
        'Enter': '=', 
        'Escape': 'AC', 
        'Backspace': 'C',
        '^': 'x ʸ', 
        'r': 'ʸ√x̄', 
        "(":"(", 
        ")":")", 
        "%":"%"
      };
      const value = keyMappings[e.key];
      if (value) {
        e.preventDefault();
        handleclick(value);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [dispSup, dispInf, decimalUsed, newOperation]);

  const formatResult = (num) => {
    try {
      const number = typeof num === "string" ? parseFloat(num) : num;
      if (isNaN(number)) return "Error";
      if (Math.abs(number) >= 1e12 || (Math.abs(number) > 0 && Math.abs(number) < 1e-12)) {
        return number.toExponential(9);
      }
      let formatted = Number(number.toFixed(12)).toString().replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");  
      if (formatted.endsWith(".")) {
        formatted = formatted.slice(0, -1);
      }  
      return formatted;
    } catch (error) {
      return "Error";
    }
  };
  
  const handleClear = (value) =>{
    if (value === "AC" || (value === "C" && newOperation == true)) {
      setDispSup("");
      setDispInf("0");
      setDecimalUsed(false);
      setNewOperation(false);
      return;
    }
    else if(value === "C"){
      setDispInf(dispInf.length>1? dispInf.slice(0, -1) : "0")
      return
    }    
  }  

  const handleOperator = (value) => {
    if (["+", "-", "x", "÷", "^", "%","Error",""].includes(dispInf)) return
    if (newOperation) {
      setDispSup(dispInf+value);
      setNewOperation(false);
    }
    else {
      setDispSup((prev) => prev + (isNaN(parseFloat(dispInf))? "" : dispInf )  + value)
    }
    setDispInf(value);
    setOperation(true)      
    setDecimalUsed(false)
  };

  const handleInverse = () => {
    if (["+", "-", "x", "÷", "^", "%","Error",""].includes(dispInf)) return
    if(dispSup == "" || newOperation){
      setDispInf(formatResult(eval("1/"+ dispInf)).toString())
      setDispSup("1/"+ dispInf)
      setNewOperation(true);
    }
    setDispInf(formatResult(eval("1/"+ dispInf)).toString())
    setDecimalUsed(false);
  }
  
  const handleNthRoot = () => {
    if (["Error", "", "(", "+", "-", "x", "÷", "^", "%"].includes(dispInf)) return;
    const superscriptMap = {'0': '⁰', '1': '¹', '2': '²', '3': '³','4': '⁴', '5': '⁵', '6': '⁶','7': '⁷', '8': '⁸', '9': '⁹','.': '⋅', "e": "ᵉ", "+":"⁺", "-":"⁻", "(":"⁽", ")": "⁾"};
    let superscriptY;
    if (dispSup.endsWith(")")) {
      if(dispSup.lastIndexOf("(") == 1){
        superscriptY = "⁽" + dispSup.slice(1, -1).split("").map((char) => superscriptMap[char] || char).join("") + "⁾";
        setDispSup(superscriptY + "√" );
      } 
      else{
        superscriptY = "⁽" + dispSup.slice(dispSup.lastIndexOf("(")+1, -1).split("").map((char) => superscriptMap[char] || char).join("") + "⁾";
        setDispSup(dispSup.slice(0, dispSup.lastIndexOf("(")) +superscriptY + "√" );
    }
    } else {
      superscriptY = dispInf.split("").map((char) => superscriptMap[char] || char).join("");
      setDispSup(dispSup + superscriptY + "√" );
    }
    
    setDispInf(""); 
    setNewOperation(false);
  };

  const handleParenthesis = (value) =>{
    const isInvalidOperator = dispInf === "("  && value == "(" || dispInf === ")"  && value == ")" ||  dispInf === "("  && value == ")"  || dispInf === ")"  && value == "(" || dispInf === "Error" ||  value == ")" && !dispSup.includes("(");
    if (isInvalidOperator) {
      return
    }
    if (newOperation || dispInf === "0") {
      setDispSup(value);
      setDispInf(value);
      setNewOperation(false);
      setOperation(true)
      return;
    }
    else{
      setDispSup((prev) => prev + (isNaN(parseFloat(dispInf))? "" : dispInf )  + value)     
      setDispInf(value);
      setOperation(true)
      return;
    }
  }

  const handleEqual = () =>{
    if (!newOperation && dispSup !== "") {
      try {
        const operands = isNaN(parseFloat(dispInf))? dispSup : dispSup + dispInf
        let expression = operands.replace(/x/g, "*").replace(/÷/g, "/").replace(/\^/g, "**").replace(/%/g, "/100*")
        .replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⋅ᵉ⁺⁻⁽⁾]+)√(\([^()]+\)|\d+\.?\d*(e[+-]?\d+)?)/g, (match, superscriptY, x) => {
          const y = superscriptY
            .split("")
            .map((char) => {
              switch (char) {
                case '⁰': return '0';
                case '¹': return '1';
                case '²': return '2';
                case '³': return '3';
                case '⁴': return '4';
                case '⁵': return '5';
                case '⁶': return '6';
                case '⁷': return '7';
                case '⁸': return '8';
                case '⁹': return '9';
                case '⋅': return '.';
                case 'ᵉ': return 'e';
                case '⁺': return '+';
                case "⁻": return "-";
                case "⁽" : return "("; 
                case "⁾" : return ")";
                default: return char;
              }
            })
            .join("");
          return `(${x})**(1/${y})`;
        });
        setDispSup((prev) => prev + (isNaN(parseFloat(dispInf))? "" : dispInf )  + "=")     
        setDispInf(formatResult(eval(expression)).toString());
        setNewOperation(true);
        setDecimalUsed(false);
      } catch (error) {
        setDispInf("Error");
        setNewOperation(true);
        setDecimalUsed(false);
      }
    };
  }
  
  const handleNumberOrDecimal = (value) => {
    if (dispInf === "Error") {
      setDispSup("");
      setDispInf(value);
      setNewOperation(false);
      return;
    }

    if (dispInf === "0") {
      const newValue = value === "." ? "0." : value;     
      setDispInf(newValue);      
      setDecimalUsed(value === ".");
      return;
    }
  
    if (value === ".") {
      if (!decimalUsed) {
        setDispInf((prev) => prev + value);
        setDecimalUsed(true);
      }
      return;
    }

    if (newOperation === true) {
      setDispSup("");
      setNewOperation(false);
    }
  
    if (dispInf.includes("e") && !newOperation) {
      const [base, exponent] = dispInf.split("e");
      if (exponent >0){
        const updatedExponent = parseInt(exponent, 10) + 1
        setDispInf(`${base}e+${updatedExponent}`);
      }
      else {
        const updatedExponent = parseInt(exponent, 10) - 1
        setDispInf(`${base}e${updatedExponent}`);
      }
    } else {
      let updatedDispInf = (operation || newOperation )? value : dispInf + value;
      setOperation(false);
      const digitCount = updatedDispInf.replace(/[^0-9]/g, "").length;
      if (digitCount > 12 && parseFloat(updatedDispInf) == 0 && decimalUsed){
        setDispInf("0.000000000001")
      }
      else{
        setDispInf(digitCount > 12? formatResult(updatedDispInf): updatedDispInf);
      }
    }
  };

  const handleclick = (value) => {  
    switch (value) {
      case "AC":
      case "C":
        handleClear(value)
        return
      case "+":
      case "-":
      case "x":
      case "÷":
      case "%":
        handleOperator(value);
        return;
      case "(":
      case ")":
        handleParenthesis(value)
        return
      case "x ʸ":
        handleOperator("^");
        return;
      case "1/x":
        handleInverse()
        return
      case "ʸ√x̄":
        handleNthRoot();
        return;
      case "=":
        handleEqual()
        return
      default:
        handleNumberOrDecimal(value);
    }
  };

  return (
    <div className='container'>
      <div className='calculadora'>
      <div className="lcd-display">
        <div className="lcd-line lcd-upper">{dispSup}</div>
        <div className="lcd-line lcd-lower">
          {dispInf.includes("e") ? formatResult(dispInf) : dispInf}
        </div>
      </div>
        <div className='botones'>
          {["AC", "(", ")", "%", "x ʸ", "ʸ√x̄", "1/x", "+", "7", "8", "9", "-", "4", "5", "6", "x", "1", "2", "3", "÷","0", ".", "C", "="].map(item =>
            <Button 
              label={item} 
              className={
                ["+", "-", "x", "÷", "x ʸ", "ʸ√x̄", "1/x", "%", "(", ")"].includes(item) ? "operator" :
                ["AC", "=", "C"].includes(item) ? "special" : ""}
              onPress={() => handleclick(item)}/>)
          }
        </div>
      </div>
    </div>
  )
}

export default Calculator
