import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isValidEthereum } from '../utils/ledgerEthUtils';
import { Input, List, ListItem, Text as TextItem, Item } from 'native-base';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

export default class Home extends React.PureComponent {
    state = {
        value: '',
        history: []
    };

    onChangeText = (value) => {
        this.setState({ value });
    };

    onPress = () => {
        if (isValidEthereum(this.state.value)) {
            if (!this.state.history.includes(this.state.value)) {
                this.setState({ history: [ ...this.state.history, this.state.value ], value: '' });
            } else {
                this.setState({ value: '' });
            }
            this.props.navigation.navigate('Details', {
                ethereum: this.state.value
            });
        }
    };
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Open an Ethereum account</Text>
                <Item regular>
                    <Input
                        onChangeText={this.onChangeText}
                        value={this.state.value}
                        onEndEditing={this.onPress}
                        style={styles.input}
                    />
                </Item>
                <ScrollView>
                    <History values={this.state.history} navigation={this.props.navigation} />
                </ScrollView>
            </View>
        );
    }
}

function HistoryItem({ item, onPressItem }) {
    return (
        <ListItem onPress={onPressItem}>
            <TextItem>{item}</TextItem>
        </ListItem>
    );
}
class History extends React.PureComponent {
    onPressHistoryItem = (item) => () => {
        this.props.navigation.navigate('Details', { ethereum: item });
    };
    _renderItems = ({ item }) => <HistoryItem item={item} onPressItem={this.onPressHistoryItem(item)} />;
    _keyExtractor = (item) => item;
    render() {
        console.log(this.props.values);
        return (
            <List>
                <ListItem itemHeader>
                    <TextItem>History</TextItem>
                </ListItem>
                <FlatList data={this.props.values} renderItem={this._renderItems} keyExtractor={this._keyExtractor} />
            </List>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25
    },
    text: {
        fontSize: 24,
        alignSelf: 'center'
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 0.2,
        padding: 10,
        borderRadius: 5,
        fontSize: 25
    }
});
