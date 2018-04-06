/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight
} from 'react-native';

import CellularAutomaton from './CellularAutomaton'

import olivaw from 'olivaw';

type Props = {};
export default class CellularAutomatonControls extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      rule: '30',
      isPaused: false,
      didReset: false,
      didAppliedRule: false,
      willAddNextRow: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  changedCARule = () => {
    this.setState({ didAppliedRule: false, isPaused: false, didReset: false, willAddNextRow: false });
  }

  resetedCA = () => {
    this.setState({ didAppliedRule: false, didReset: false, willAddNextRow: false });
  }

  getRuleInBinary = (rule: number) => {
    return `000000000${parseInt(number, 10).toString(2)}`.substr(-8);
  }

  applyCARule = () => {
    if (this.state.isPaused) {
      this.setState({ isPaused: false , willAddNextRow: false});
    }else if (parseInt(this.state.rule) >= 0 && parseInt(this.state.rule) < 255) {
      this.setState({ didAppliedRule: true });
    }
  }

  resetCA = () => {
    this.setState({ didReset: true });
  }

  pauseCA = () => {
    this.state.isPaused ? this.setState({ willAddNextRow: true }) : this.setState({ isPaused: true });
  }

  render() {

    return (
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
              onChangeText={(rule) => this.setState({rule})}
              value={this.state.rule}
              textAlign={'center'}
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
    );
  }
}

const styles = StyleSheet.create({
  viewSettings: {
    flex: 1,
    backgroundColor: '#333',
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
