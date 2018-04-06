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
  View
} from 'react-native';

import olivaw from 'olivaw';

type Props = {};
export default class CellularAutomaton extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      generatedCAArray: [],
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.didReset) {
      this.clearCAArray();
      this.props.resetedCA();
    }else if (nextProps.didAppliedRule) {
      this.setupCA();
      this.props.changedCARule();
    }else if (nextProps.willAddNextRow) {
      this.addCARow();
    }else if (nextProps.isPaused) {
      this.clearCAInterval();
    }else {
      this.setupCAInterval();
    }
  }

  setupCA = () => {
    const { rule } = this.props;
    this.automaton = olivaw({
      rule: parseInt(rule),
      population: 32,
      life: 2000
    });

    this.automata = this.automaton.set();

    this.setupCAInterval();
  }

  addCARow = () => {
    var { generatedCAArray, index } = this.state;

    for (var i = 0; i < this.automata[index].length; i++) {
      var rowData = <View key={'active'+i.toString()} style={styles.activeCell}></View>;
      if (this.automata[index][i].state == 0)
        rowData = <View key={'inactive'+i.toString()} style={styles.inactiveCell}></View>

      generatedCAArray.push(rowData);
    }

    index = index+1;
    this.setState({generatedCAArray, index});
  }

  rowComponent = (key, row) => (
    <View key={'row'+key.toString()} style={styles.row}>
      {row}
    </View>
  );

  setupCAInterval = () => {
    this.clearCAInterval();
    this.intervalSetupCA = setInterval(this.addCARow, 2000);
  }

  clearCAArray = () => {
    this.setState({ generatedCAArray: [] });
  }

  clearCAInterval = () => {
    clearInterval(this.intervalSetupCA);
  }

  render() {
    const rowsCA = this.state.generatedCAArray.map((rows, index) => this.rowComponent(index, rows));
    const renderItem = ({ item }) => <View style={styles.item}>{item}</View>;
    const getItemLayout = (data, index) => ({length: 10, offset: 10 * index, index});

    return (
      <FlatList
        data={rowsCA}
        ref={ref => this.flatList = ref}
        numColumns={32}
        onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
        extraData={this.state.generatedCAArray}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  activeCell: {
    width: 10,
    height: 10,
    backgroundColor: '#333',
  },
  inactiveCell: {
    width: 10,
    height: 10,
    backgroundColor: '#f0f0f0',
  },
  item: {
    alignItems: 'center',
    flexGrow: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  }
});
