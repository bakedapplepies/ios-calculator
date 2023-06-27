import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export default function App() {  // render call
  enum Operators {
    Add,
    Sub,
    Mul,
    Div,
    None,
  }
  enum Signs {
    Positive,
    Negative,
  }

  const [currentNumberWhole, setCurrentNumberWhole] = useState(0);
  const [currentNumberDecimal, setCurrentNumberDecimal] = useState(0);
  const [cacheNumber, setCacheNumber] = useState(0);
  const [hasDecimalPoint, setDecimalPoint] = useState(false);
  const [decimalLength, setDecimalLength] = useState(0);

  const [currentSign, setCurrentSign] = useState(Signs.Positive);
  const [currentOperator, setCurrentOperator] = useState(Operators.None);
  const [resetNumber, setResetNumber] = useState(false);

  const [justPressedArithButton, setJustPressedArithButton] = useState(false);
  const [justPressedNumberButton, setJustPressedNumberButton] = useState(false);
  const [justPressedResult, setJustPressedResult] = useState(false);

  const setNumber = (num: number) => (): void => {
    let newNumberWhole: number = currentNumberWhole;
    let newNumberDecimal: number = currentNumberDecimal;
    let newDecimalLength: number = decimalLength;
    let hasDecimalPointLocal: boolean = hasDecimalPoint;
    let signLocal: Signs = currentSign;
    
    if (resetNumber)
    {
      setResetNumber(false);

      hasDecimalPointLocal = false;
      setDecimalPoint(hasDecimalPointLocal);
      setCurrentSign(Signs.Positive);

      newNumberWhole = 0;
      newNumberDecimal = 0;
      newDecimalLength = 0;
    }

    if (!hasDecimalPointLocal) {
      newNumberWhole = newNumberWhole * 10 + num;
    }
    else {
      newNumberDecimal = newNumberDecimal * 10 + num;
      newDecimalLength += 1;
    }

    setCurrentNumberWhole(newNumberWhole);
    setCurrentNumberDecimal(newNumberDecimal);
    setDecimalLength(newDecimalLength);
    setJustPressedArithButton(false);
    setJustPressedNumberButton(true);
    setJustPressedResult(false);
  }

  const ACClear = (): void => {
    let currentNumber: number = currentNumberWhole + currentNumberDecimal * Math.pow(10, -decimalLength);

    if (justPressedResult)
    {
      setCacheNumber(0);
      setCurrentOperator(Operators.None);
      setJustPressedResult(false);
    }

    if (currentNumber !== 0)
    {
      setCurrentNumberWhole(0);
      setCurrentNumberDecimal(0);
      setDecimalPoint(false);
      setDecimalLength(0);
      setCurrentSign(Signs.Positive);
    }
    else
    {
      setCurrentOperator(Operators.None);
    }
    
    setJustPressedNumberButton(false);
  }

  const toggleDecimal = (): void => {
    if (hasDecimalPoint && currentNumberDecimal !== 0) {
      return;
    }
    setDecimalPoint(!hasDecimalPoint);
  }

  const toggleSign = (): void => {
    if (currentNumberWhole !== 0 || currentNumberDecimal !== 0)
    {
      if (currentSign === Signs.Positive)
      {
        setCurrentSign(Signs.Negative);
      }
      else
      {
        setCurrentSign(Signs.Positive);
      }
    }
  }

  const setOperator = (operator: Operators) => (): void => {
    let signMultiplier: number = currentSign === Signs.Positive ? 1 : -1;
    let cacheCurrentNumber: number = signMultiplier * (currentNumberWhole + currentNumberDecimal * Math.pow(10, -decimalLength));
    
    if (currentOperator != Operators.None && cacheCurrentNumber !== 0 && !resetNumber)
    {
      cacheCurrentNumber = getResult();
    }

    setCacheNumber(cacheCurrentNumber);
    setCurrentOperator(operator);
    setResetNumber(true);
    setJustPressedArithButton(true);
    setJustPressedNumberButton(false);
  }

  const getResult = (): number => {
    let result: number = 0;
    let currentNumber: number = currentNumberWhole + currentNumberDecimal * Math.pow(10, -decimalLength);

    if (currentOperator === Operators.None)
    {
      return 0;
    }

    if (!justPressedResult)
    {
      if      (currentOperator === Operators.Add) result = cacheNumber + currentNumber;
      else if (currentOperator === Operators.Sub) result = cacheNumber - currentNumber;
      else if (currentOperator === Operators.Mul) result = cacheNumber * currentNumber;
      else if (currentOperator === Operators.Div) result = cacheNumber / currentNumber;
    }
    else
    {
      if      (currentOperator === Operators.Add) result = currentNumber + cacheNumber;
      else if (currentOperator === Operators.Sub) result = currentNumber - cacheNumber;
      else if (currentOperator === Operators.Mul) result = currentNumber * cacheNumber;
      else if (currentOperator === Operators.Div) result = currentNumber / cacheNumber;
    }

    let newCurrentNumberWhole: number = Math.floor(result);
    let newCurrentNumberDecimal: number = result - newCurrentNumberWhole;  // still in 0.x form
    let newDecimalLength: number = newCurrentNumberDecimal.toString().length - 1
    if (newCurrentNumberDecimal !== 0)
    {
      newDecimalLength -= 1;
      newCurrentNumberDecimal *= 10 ** newDecimalLength;
      setDecimalPoint(true);
    }

    if (justPressedNumberButton)
    {
      setCacheNumber(currentNumber);
    }

    setCurrentNumberWhole(newCurrentNumberWhole);
    setCurrentNumberDecimal(newCurrentNumberDecimal);
    setDecimalLength(newDecimalLength);
    setResetNumber(true);
    setJustPressedNumberButton(false);

    return result;
  }

  const resultButtonFunction = () => {
    getResult();
    setJustPressedResult(true);
  }

  const getLeadingZeroDecimal = (): string => {
    let decimalStrLen: number = currentNumberDecimal.toString().length;

    if (currentNumberDecimal === 0) {
      return "0".repeat(decimalLength - (decimalStrLen - 1));
    }
    else {
      if (decimalLength > decimalStrLen) {
        return "0".repeat(decimalLength - decimalStrLen);
      }
      else {
        return "";
      }
    }
  }

  const getSign = (): string => {
    if (currentSign === Signs.Negative && (currentNumberWhole !== 0 || currentNumberDecimal !== 0))
    {
      return "-";
    }
    return "";
  }

  const getArithmeticButtonStyle = (operator: Operators) => {
    if (operator === currentOperator && justPressedArithButton)
    {
      return styles.inverse_arithmetic_button;
    }
    return styles.arithmetic_button;
  }
  
  const getArithmeticTextStyle = (operator: Operators) => {
    if (operator === currentOperator && justPressedArithButton)
    {
      return styles.inverse_button_text;
    }
    return styles.reg_text;
  }

  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Number display */}
      <View style={styles.result_display}>
        <Text style={[styles.result_text]}>
          {getSign()}
          {currentNumberWhole}
          {hasDecimalPoint ? "," : ""}
          {getLeadingZeroDecimal()}
          {currentNumberDecimal !== 0 ? currentNumberDecimal : ""}
        </Text>
      </View>

      {/* Buttons */}
      <View style={{ flex: 3, }}>

        <View style={styles.button_row}>
          <TouchableOpacity style={[styles.button, styles.special_button]} onPress={ACClear}>
            <Text style={[styles.button_text, styles.special_text]}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.special_button]} onPress={toggleSign}>
            <Text style={[styles.button_text, styles.special_text]}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.special_button]}>
            <Text style={[styles.button_text, styles.special_text]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, getArithmeticButtonStyle(Operators.Div)]} onPress={setOperator(Operators.Div)}>
            <Text style={[styles.button_text, getArithmeticTextStyle(Operators.Div), { fontSize: 42 }]}>÷</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.button_row]}>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(7)}>
            <Text style={[styles.button_text, styles.reg_text]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(8)}>
            <Text style={[styles.button_text, styles.reg_text]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(9)}>
            <Text style={[styles.button_text, styles.reg_text]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, getArithmeticButtonStyle(Operators.Mul)]} onPress={setOperator(Operators.Mul)}>
            <Text style={[styles.button_text, getArithmeticTextStyle(Operators.Mul), { fontSize: 42 }]}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.button_row]}>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(4)}>
            <Text style={[styles.button_text, styles.reg_text]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(5)}>
            <Text style={[styles.button_text, styles.reg_text]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(6)}>
            <Text style={[styles.button_text, styles.reg_text]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, getArithmeticButtonStyle(Operators.Sub)]} onPress={setOperator(Operators.Sub)}>
            <Text style={[styles.button_text, getArithmeticTextStyle(Operators.Sub), { fontSize: 42 }]}>–</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.button_row]}>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(1)}>
            <Text style={[styles.button_text, styles.reg_text]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(2)}>
            <Text style={[styles.button_text, styles.reg_text]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={setNumber(3)}>
            <Text style={[styles.button_text, styles.reg_text]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, getArithmeticButtonStyle(Operators.Add)]} onPress={setOperator(Operators.Add)}>
            <Text style={[styles.button_text, getArithmeticTextStyle(Operators.Add), { fontSize: 42 }]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.button_row]}>
          <TouchableOpacity style={[styles.button, styles.reg_button, { width: 180, alignItems: "baseline" }]} onPress={setNumber(0)}>
            <Text style={[styles.button_text, styles.reg_text, { marginLeft: 33 }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={toggleDecimal}>
            <Text style={[styles.button_text, styles.reg_text]}>,</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={resultButtonFunction}>
            <Text style={[styles.button_text, styles.reg_text, { fontSize: 42 }]}>=</Text>
          </TouchableOpacity>
        </View>

      </View>

      <StatusBar style="inverted" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
  },

  result_display: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: 348
  },

  result_text: {
    color: "white",
    fontSize: 90,
  },

  button_row: {
    flex: 1,
    width: 370,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    // flex: 1,
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },

  reg_button: {
    backgroundColor: "#333333",
  },

  special_button: {
    backgroundColor: "#a5a5a5",
  },

  arithmetic_button: {
    backgroundColor: "#f1a43c",
    paddingLeft: 1,
    paddingBottom: 2,
  },

  inverse_arithmetic_button: {
    backgroundColor: "white",
  },

  button_text: {
    fontSize: 34,
    fontWeight: "500",
  },

  reg_text: {
    color: "white",
  },

  special_text: {
    color: "black",
  },

  inverse_button_text: {
    color: "#f1a43c",
  }
});
