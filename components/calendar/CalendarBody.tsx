import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CalendarBodyProps {
  matrix: Array<Array<{ day: number; type: "prev" | "current" | "next" }>>;
  today: Date;
  year: number;
  month: number;
  selectedDate: { year: number; month: number; day: number } | null;
  setSelectedDate: (
    date: { year: number; month: number; day: number } | null
  ) => void;
}

export default function CalendarBody({
  matrix,
  today,
  year,
  month,
  selectedDate,
  setSelectedDate,
}: CalendarBodyProps) {
  return (
    <>
      {matrix.map((week, i) => (
        <View key={i} style={styles.weekRow}>
          {week.map((cell, j) => {
            const isSelected =
              selectedDate &&
              cell.type === "current" &&
              selectedDate.year === year &&
              selectedDate.month === month &&
              selectedDate.day === cell.day;

            const mergedStyle = [
              styles.day,
              cell.type === "current" && styles.currentDay,
              (cell.type === "prev" || cell.type === "next") &&
                styles.otherMonth,
              j === 0 &&
                (cell.type === "current" ? styles.sun : styles.otherMonthSun),
              j === 6 && styles.sat,
              isSelected && styles.selectedDayText,
            ];

            return (
              <View key={j} style={styles.dayCell}>
                <TouchableOpacity
                  disabled={cell.type !== "current"}
                  onPress={() => {
                    if (cell.type === "current") {
                      if (
                        selectedDate &&
                        selectedDate.year === year &&
                        selectedDate.month === month &&
                        selectedDate.day === cell.day
                      ) {
                        setSelectedDate(null);
                      } else {
                        setSelectedDate({ year, month, day: cell.day });
                      }
                    }
                  }}
                  style={isSelected ? styles.selectedDay : undefined}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                >
                  <Text style={mergedStyle}>{cell.day}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: 350,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    marginVertical: 2,
    height: 38,
    justifyContent: "center",
  },
  day: {
    fontSize: 17,
    color: "#222",
  },
  currentDay: {
    color: "#222",
    fontWeight: "500",
  },
  otherMonth: {
    color: "#d0d0d0",
  },
  otherMonthSun: {
    color: "#f2bcbc",
  },
  sun: {
    color: "#e57373",
  },
  sat: {
    color: "#64b5f6",
  },
  selectedDay: {
    borderRadius: 19,
    borderColor: "#1976d2",
    borderWidth: 2,
    backgroundColor: "transparent",
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  selectedDayText: {
    color: "#1565c0",
    fontWeight: "bold",
  },
});
