import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";

export default function BookDetailsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Book Details" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Book details will appear here.</Text>
      </View>
    </View>
  );
}
