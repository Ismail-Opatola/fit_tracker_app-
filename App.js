import React from "react";
import { View, Platform, StatusBar } from "react-native";
import AddEntry from "./components/AddEntry";
import History from "./components/History";
import EntryDetail from "./components/EntryDetail";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import {
  createBottomTabNavigator,
  createAppContainer,
  createNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";
import { purple, white } from "./utils/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Constants } from "expo";

function CustomStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const Tabs = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: "History",
      tabBarIcon: ({ tintColor }) =>
        Platform.OS === "ios" && (
          <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
        )
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: "Add Entry",
      tabBarIcon: ({ tintColor }) =>
        Platform.OS === "ios" && (
          <FontAwesome name="plus-square" size={30} color={tintColor} />
        )
    }
  }
};

const navigationOptions = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    // showIcon: true,
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      padding: 10,
      height: Platform.OS === "ios" ? 60 : "auto",
      fontSize: 18,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const TabNav =
  Platform.OS === "ios"
    ? createBottomTabNavigator(Tabs, navigationOptions)
    : createMaterialTopTabNavigator(Tabs, navigationOptions);

const MainNavigator = createStackNavigator({
  home: {
    screen: TabNav,
    // navigationOptions: {
    //   header: null
    // }
  },
  EntryDetail: {
    screen: EntryDetail,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple
      }
    })
  }
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <CustomStatusBar backgroundColor={purple} barStyle="light-content" />
          <AppContainer />
        </View>
      </Provider>
    );
  }
}
