import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to Rate-a-Book!</Text>
      </View>
    </View>
  );
}
