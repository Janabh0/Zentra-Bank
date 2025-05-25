import { View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Build, extract, refactor */}
      <View
        style={{
          flexDirection: "row",
          gap: 80,
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <CategoryCard cardTitle="Tips" />
        <CategoryCard cardTitle="Yoga Videos" />
        <CategoryCard cardTitle="Music" />
        <CategoryCard cardTitle="Meditation" /> */}
      </View>
    </View>
  );
}
