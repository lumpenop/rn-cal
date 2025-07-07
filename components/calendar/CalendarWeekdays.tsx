import { View, Text, StyleSheet } from "react-native";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarWeekdays() {
  return (
    <View style={styles.weekRow}>
      {WEEKDAYS.map((d, i) => (
        <Text
          key={d}
          style={[styles.weekday, i === 0 && styles.sun, i === 6 && styles.sat]}
        >
          {d}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: 350,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    color: "#b0b0b0",
    fontSize: 15,
    marginBottom: 8,
  },
  sun: {
    color: "#e57373",
  },
  sat: {
    color: "#64b5f6",
  },
});
