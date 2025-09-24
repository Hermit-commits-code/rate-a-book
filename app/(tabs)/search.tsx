import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
export default function SearchScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Search & Filter" />
      </Appbar.Header>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Search and filter your books here.</Text>
      </View>
    </View>
  );
}
