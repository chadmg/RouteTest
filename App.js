import React from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import {
  NativeRouter,
  Route,
  Link,
  withRouter,
  Switch,
  Redirect
} from "react-router-native";

const { width, height } = Dimensions.get("window");

class Home extends React.Component {
  render() {
    return (
      <View>
        <Text>Home</Text>
      </View>
    );
  }
}

class About extends React.Component {
  render() {
    return (
      <View>
        <Text>About</Text>
      </View>
    );
  }
}

class AnimatedChild extends React.Component {
  state = {
    // we're going to save the old children so we can render
    // it when it doesnt' actually match the location anymore
    previousChildren: null
  };
  anim = new Animated.Value(1);

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.setState({
        previousChildren: this.props.children
      });
      Animated.timing(this.anim, {
        toValue: 0,
        duration: 200
      }).start(() => {
        this.setState({
          previousChildren: null
        });
        Animated.timing(this.anim, {
          toValue: 1,
          duration: 200
        }).start();
      });
    }
  }

  render() {
    const { anim } = this;
    const { children } = this.props;
    const { previousChildren } = this.state;
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          }),
          opacity: anim.interpolate({
            inputRange: [0, 0.75],
            outputRange: [0, 1]
          })
        }}
      >
        {/* render the old ones if we have them */}
        {previousChildren || children}
      </Animated.View>
    );
  }
}

class ParentWithoutRouter extends React.Component {
  render() {
    return (
      <View>
        <AnimatedChild location={this.props.location}>
          <Switch location={this.props.location}>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </Switch>
        </AnimatedChild>
      </View>
    );
  }
}

const Parent = withRouter(ParentWithoutRouter);

const App = () => (
  <NativeRouter>
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Home</Text>
        </Link>
        <Link to="/about" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>About</Text>
        </Link>
      </View>

      <Parent />
    </View>
  </NativeRouter>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    fontSize: 20
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    padding: 10
  },
  subNavItem: {
    padding: 5
  },
  topic: {
    textAlign: "center",
    fontSize: 15
  }
});

export default App;
