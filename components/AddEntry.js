import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet
} from "react-native";
import {NavigationActions} from 'react-navigation'
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from "../utils/helpers";
import { submitEntry, removeEntry } from "../utils/api";
import Slider from "./Slider";
import Steppers from "./Steppers";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.androidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  };
  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count
      };
    });
  };
  decrement = metric => {
    this.setState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }));
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: entry
      })
    );
    
    // Save to 'DB'
    submitEntry({ key, entry });

    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });
    
    // Clear local notification

    // Navigate to home
    this.toHome()
  };
  reset = () => {
    const key = timeToString();

    // Update Redux
    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );
    // Update "DB"
    removeEntry(key);
    // Route to Home
    this.toHome()
  };

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      // from
      key: 'AddEntry'
    }))
  }
  render() {
    const metaInfo = getMetricMetaInfo();
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === 'ios' ? 'ios-happy-outline' : "md-happy"} size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton style={{padding: 10 }} onPress={this.reset}>Reset</TextButton>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === "slider" ? (
                <Slider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <Steppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    height: 45,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  }
});

function mapStateToProps(state) {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}
export default connect(mapStateToProps)(AddEntry);
