import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {  // render call
  enum Operators {
    Add,
    Sub,
    Mul,
    Div,
    None,
  }

  const [currentNumberWhole, setCurrentNumberWhole] = useState(0);
  const [currentNumberDecimal, setCurrentNumberDecimal] = useState(0);
  const [cacheNumber, setCacheNumber] = useState(0);
  const [hasDecimalPoint, setDecimalPoint] = useState(false);
  const [decimalLength, setDecimalLength] = useState(0);
  const [currentOperator, setCurrentOperator] = useState(Operators.None);
  const [resetNumber, setResetNumber] = useState(false);

  const setNumber = (num: number) => (): void => {
    let newNumberWhole: number = currentNumberWhole;
    let newNumberDecimal: number = currentNumberDecimal;
    let newDecimalLength: number = decimalLength;
    let hasDecimalPointLocal: boolean = hasDecimalPoint;
    
    if (resetNumber)
    {
      setResetNumber(false);

      hasDecimalPointLocal = false;
      setDecimalPoint(hasDecimalPointLocal);

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
  }

  const ACClear = (): void => {
    setCurrentNumberWhole(0);
    setCurrentNumberDecimal(0);
    setCacheNumber(0);
    setDecimalPoint(false);
    setDecimalLength(0);
    setCurrentOperator(Operators.None);
  }

  const toggleDecimal = (): void => {
    if (hasDecimalPoint && currentNumberDecimal !== 0) {
      return;
    }
    setDecimalPoint(!hasDecimalPoint);
  }

  const setOperator = (operator: Operators) => (): void => {
    let cacheCurrentNumber: number = currentNumberWhole + currentNumberDecimal * Math.pow(10, -decimalLength);

    if (cacheCurrentNumber === 0 || resetNumber)  // if number is about to be reset -> no cache
    {
      return;
    }

    setCacheNumber(cacheCurrentNumber);
    setCurrentOperator(operator);
    setResetNumber(true);
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

  const getResult = (): void => {
    let result: number = 0;
    let currentNumber: number = currentNumberWhole + currentNumberDecimal * Math.pow(10, -decimalLength);

    if (currentOperator === Operators.None || currentNumber === 0)
    {
      return;
    }

    if      (currentOperator === Operators.Add) result = cacheNumber + currentNumber;
    else if (currentOperator === Operators.Sub) result = cacheNumber - currentNumber;
    else if (currentOperator === Operators.Mul) result = cacheNumber * currentNumber;
    else if (currentOperator === Operators.Div) result = cacheNumber / currentNumber;

    let newCurrentNumberWhole: number = Math.floor(result);
    let newCurrentNumberDecimal: number = result - newCurrentNumberWhole;
    newCurrentNumberDecimal *= 10 ** (newCurrentNumberDecimal.toString().length - 2); // exclude the "0."

    setCurrentNumberWhole(newCurrentNumberWhole);
    setCurrentNumberDecimal(newCurrentNumberDecimal);
  }

  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Number display */}
      <View style={styles.result_display}>
        <Text style={[styles.result_text]}>
          {currentNumberWhole !== 0 ? currentNumberWhole : ""}
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
          <TouchableOpacity style={[styles.button, styles.special_button]}>
            <Text style={[styles.button_text, styles.special_text]}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.special_button]}>
            <Text style={[styles.button_text, styles.special_text]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={setOperator(Operators.Div)}>
            <Text style={[styles.button_text, styles.reg_text, { fontSize: 42 }]}>÷</Text>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={setOperator(Operators.Mul)}>
            <Text style={[styles.button_text, styles.reg_text, { fontSize: 42 }]}>×</Text>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={setOperator(Operators.Sub)}>
            <Text style={[styles.button_text, styles.reg_text, { fontSize: 42 }]}>–</Text>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={setOperator(Operators.Mul)}>
            <Text style={[styles.button_text, styles.reg_text, { fontSize: 42 }]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.button_row]}>
          <TouchableOpacity style={[styles.button, styles.reg_button, { width: 180, alignItems: "baseline" }]} onPress={setNumber(0)}>
            <Text style={[styles.button_text, styles.reg_text, { marginLeft: 33 }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.reg_button]} onPress={toggleDecimal}>
            <Text style={[styles.button_text, styles.reg_text]}>,</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]} onPress={getResult}>
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
    width: 375,
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
