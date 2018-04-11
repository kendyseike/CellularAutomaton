/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import CellularAutomaton from './CellularAutomaton'
import { getRuleInBinary, getRuleInString } from '../utils/CellularAutomatonHelper'

import olivaw from 'olivaw';

type Props = {};
export default class CellularAutomatonControls extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      firstRowCAArray: [],
      rule: '30',
      isPaused: false,
      didReset: false,
      didAppliedRule: false,
      willAddNextRow: false
    };
  }

  componentDidMount() {
    this.setupCAFirstRow(getRuleInBinary(this.state.rule))
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  didBeginEditting = (rule) => {
      this.setState({ rule }, () => {
        this.setupCAFirstRow(getRuleInBinary(rule))
      })


  }

  changedCARule = () => {
    this.setState({ didAppliedRule: false, isPaused: false, didReset: false, willAddNextRow: false });
  }

  resetedCA = () => {
    this.setState({ didAppliedRule: false, didReset: false, willAddNextRow: false });
  }

  applyCARule = () => {
    this.state.isPaused                  ? this.setState({ isPaused: false, willAddNextRow: false}) :
    this.validateCARule(this.state.rule) ? this.setState({ didAppliedRule: true })
                                         : this.showCARuleError()
  }

  validateCARule = (rule) => {
    return /^[0-9\b]+$/.test(rule) && parseInt(rule) >= 0 && parseInt(rule) <= 255;
  }

  showCARuleError = () => {
    Alert.alert(
      'Ops!',
      'Digite somente números entre 0 e 255 :)',
      [
        {text: 'OK', onPress: () => console.log('alert dismiss')},
      ],
      { cancelable: false }
    )
  }

  resetCA = () => {
    this.setState({ didReset: true });
  }

  pauseCA = () => {
    this.state.isPaused ? this.setState({ willAddNextRow: true }) : this.setState({ isPaused: true });
  }

  setupCAFirstRow = (ruleBinaryArray) => {
    var { firstRowCAArray } = this.state;

    for (var i = 0; i < ruleBinaryArray.length; i++) {
      var rowData = ruleBinaryArray[i] == 0 ? <View key={'active'+i.toString()} style={styles.activeCell}></View>
                                            : <View key={'inactive'+i.toString()} style={styles.inactiveCell}></View>;

      firstRowCAArray[i] == null ? firstRowCAArray.push(rowData) : firstRowCAArray[i] = rowData;
    }

    this.setState({ firstRowCAArray });
  }

  didSelectedFlatCell = (index) => {
    var binaryArray = getRuleInBinary(this.state.rule);

    binaryArray[index] = binaryArray[index] == 0 ? 1 : 0

    this.setState({ rule: getRuleInString(binaryArray) }, () => {
      this.setupCAFirstRow(binaryArray)
    })
  }

  rowComponent = (key, row) => (
    <View key={'row'+key.toString()} style={styles.row}>
      <TouchableOpacity onPress={() => this.didSelectedFlatCell(key)}>
        {row}
      </TouchableOpacity>
    </View>
  );

  render() {
    const firstRowCA = this.state.firstRowCAArray.map((rows, index) => this.rowComponent(index, rows));
    const renderItem = ({ item }) => <View style={styles.item}>{item}</View>;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.caContainer}>
            <CellularAutomaton
              rule={this.state.rule}
              isPaused={this.state.isPaused}
              didReset={this.state.didReset}
              didAppliedRule={this.state.didAppliedRule}
              willAddNextRow={this.state.willAddNextRow}
              changedCARule={this.changedCARule.bind(this)}
              resetedCA={this.resetedCA.bind(this)}
            />
          </View>
          <View style={styles.viewSettings}>
            <View style={styles.viewRule}>
              <Text style={styles.text}>
                Escolha uma regra de 0 a 255
              </Text>
              <TextInput
                style={styles.textFieldRule}
                onChangeText={this.didBeginEditting}
                value={this.state.rule}
                textAlign={'center'}
                keyboardType={'number-pad'}
              />
            </View>
            <View style={styles.flatRowView}>
              <FlatList
                data={firstRowCA}
                numColumns={8}
                extraData={this.state.firstRowCAArray}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
              />
            </View>
            <View style={styles.buttonsView}>
              <TouchableHighlight
                style={styles.button}
                onPress={this.applyCARule}
                >
                {this.state.isPaused ? <Text style={styles.text}> Continuar </Text> : <Text style={styles.text}> Aplicar </Text>}
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={this.resetCA}
                >
                <Text style={styles.text}> Resetar </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={this.pauseCA}
                >
                {this.state.isPaused ? <Text style={styles.text}> Próximo </Text> : <Text style={styles.text}> Pausar </Text>}
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  viewSettings: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    marginTop: 10
  },
  viewRule: {
    flex: 1,
    alignItems: 'center',
  },
  textFieldRule: {
    width: 150,
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    color: '#fff',
  },
  flatRowView: {
    flex: 1,
    alignItems: 'center'
  },
  activeCell: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff'
  },
  inactiveCell: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#fff'
  },
  item: {
    alignItems: 'center',
    flexGrow: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonsView: {
    flexDirection: 'row',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderColor: '#fff',
    borderWidth: 1,
    flex: 1
  },
  caContainer: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: '#fff'
  },
});
