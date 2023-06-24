import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {  // render call
  // Functions
  const [firstNumberWhole, setFirstNumberWhole] = useState(0);
  const [firstNumberDecimal, setFirstNumberDecimal] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(0);
  const [hasDecimalPoint, setDecimalPoint] = useState(false);

  const setNumber = (num: number) => (): void => {
    let newFirstNumberWhole: number = firstNumberWhole
    let newFirstNumberDecimal: number = firstNumberDecimal
    if (!hasDecimalPoint)
    {
      newFirstNumberWhole = firstNumberWhole * 10 + num;
    }
    else
    {
      newFirstNumberDecimal = firstNumberDecimal * 10 + num;
    }
    let newFirstNumber = newFirstNumberWhole + newFirstNumberDecimal * Math.pow(10, -newFirstNumberDecimal.toString().length);

    setFirstNumberWhole(newFirstNumberWhole);
    setFirstNumberDecimal(newFirstNumberDecimal);
    setDisplayNumber(newFirstNumber);
  }

  const ACClear = (): void => {
    setFirstNumberWhole(0);
    setFirstNumberDecimal(0);
    setDisplayNumber(0);
    setDecimalPoint(false);
  }

  const toggleDecimal = (): void => {
    if (hasDecimalPoint && firstNumberDecimal != 0)
    {
      return;
    }
    setDecimalPoint(!hasDecimalPoint);
  }

  // ------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Number display */}
      <View style={styles.result_display}>
        <Text style={[styles.result_text]}>
          {firstNumberWhole}{hasDecimalPoint ? "," : ""}{firstNumberDecimal ? firstNumberDecimal : ""}
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]}>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]}>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]}>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]}>
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
          <TouchableOpacity style={[styles.button, styles.arithmetic_button]}>
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
