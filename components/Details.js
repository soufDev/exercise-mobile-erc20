import React from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList } from 'react-native';
import { fetchTxs, txsToOperations, getSummary_example, formatValue } from '../utils/ledgerEthUtils';
import { List, ListItem, Icon, Header, Button, Left, Body, Text as NativeText } from 'native-base';

export default class Defails extends React.Component {
    state = {
        balances: {},
        mainBalance: null,
        tokensMagnitude: {},
        operations: [],
        ethereum: this.props.navigation.state.params.ethereum
    };
    async componentDidMount() {
        try {
            const result = await fetchTxs(this.state.ethereum);
            const operations = txsToOperations(result, this.state.ethereum);
            const { balances, tokensMagnitude } = getSummary_example(operations);
            const mainBalance = formatValue(balances['ETH'], tokensMagnitude['ETH']);
            this.setState({ balances, mainBalance, tokensMagnitude, operations });
        } catch (e) {
            throw e.message;
        }
    }
    render() {
        console.log('render');
        return (
            <View>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                            <Icon name='arrow-back' style={{ color: 'white' }} />
                        </Button>
                    </Left>
                    <Body>
                        <NativeText style={{ color: 'white' }}>{this.state.ethereum}</NativeText>
                    </Body>
                </Header>
                {this.state.ethereum && (
                    <ScrollView style={styles.container}>
                        <Text style={styles.mainBalance}>ETH {this.state.mainBalance && this.state.mainBalance}</Text>
                        <Tokens balances={this.state.balances} tokensMagnitude={this.state.tokensMagnitude} />
                        <Transactions operations={this.state.operations} />
                    </ScrollView>
                )}
            </View>
        );
    }
}

function MyToken({ item, tokenValue }) {
    return (
        <ListItem style={styles.listItem}>
            <Text style={{ fontWeight: 'bold' }}>
                {item} {tokenValue}
            </Text>
        </ListItem>
    );
}

class Tokens extends React.PureComponent {
    _keyExtractor = (item, index) => item;

    _renderItems = ({ item }) => {
        const { balances, tokensMagnitude } = this.props;
        const value = formatValue(balances[item], tokensMagnitude[item]);
        return <MyToken item={item} tokenValue={value} />;
    };

    _balancesKeys = () => Object.keys(this.props.balances);
    render() {
        return (
            <List>
                <ListItem itemDivider>
                    <Text>Tokens ({this._balancesKeys().length})</Text>
                </ListItem>
                <FlatList
                    data={this._balancesKeys()}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItems}
                />
            </List>
        );
    }
}

// should use memo with react 16.7 and avoid Class Component
class MyTransactionItem extends React.PureComponent {
    render() {
        return (
            <ListItem style={styles.listItem}>
                <Icon name={this.props.arrow} style={{ color: this.props.color, fontWeight: 'bold' }} />
                <Text style={{ color: this.props.color, fontWeight: 'bold' }}>{this.props.value}</Text>
            </ListItem>
        );
    }
}
class Transactions extends React.PureComponent {
    _keyExtractor = (item) => item.id;

    _renderItem = ({ item }) => {
        const value = formatValue(item.value, item.magnitude);
        const { arrow, color, op } =
            item.type === 'IN'
                ? { arrow: 'arrow-down', color: 'green', op: '+' }
                : { arrow: 'arrow-up', color: 'red', op: '-' };
        const transactionValue = `${op} ${item.symbol} ${value}`;
        return <MyTransactionItem arrow={arrow} color={color} value={transactionValue} />;
    };

    render() {
        return (
            <List>
                <ListItem itemDivider>
                    <Text>Transactions</Text>
                </ListItem>
                <FlatList
                    data={this.props.operations}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </List>
        );
    }
}
const styles = StyleSheet.create({
    mainBalance: {
        padding: 25,
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    listItem: {
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between'
    }
});
