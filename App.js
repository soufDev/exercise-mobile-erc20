import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/Home';
import DetailScreen from './components/Details';

const AppNativation = createStackNavigator(
    {
        Home: HomeScreen,
        Details: DetailScreen
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    }
);
export default createAppContainer(AppNativation);
