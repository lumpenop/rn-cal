import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrev} style={styles.arrowBtn}>
        <Text style={styles.arrow}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {new Date(year, month).toLocaleString("en-US", { month: "long" })}{" "}
        {year}
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.arrowBtn}>
        <Text style={styles.arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
    width: 350,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  arrowBtn: {
    padding: 8,
  },
  arrow: {
    fontSize: 22,
    color: "#8fa1b3",
  },
});
