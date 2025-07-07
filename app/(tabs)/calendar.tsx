import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const BASE_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

export default function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  // selectedDate를 { year, month, day } 형태로 변경
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const matrix = getMonthMatrix(year, month);
  const isMonth = useSharedValue(1); // 1: 월뷰, 0: 축소뷰

  const handlePrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const handleNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      console.log("제스처 시작!");
    },
    onActive: (event) => {
      console.log("제스처 활성화:", event.translationY);
    },
    onEnd: (event) => {
      console.log("제스처 종료:", event.translationY);
      if (event.translationY < -20) {
        console.log("위로 드래그 - 축소!");
        isMonth.value = withTiming(0, { duration: 300 });
      } else if (event.translationY > 20) {
        console.log("아래로 드래그 - 확장!");
        isMonth.value = withTiming(1, { duration: 300 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const heightValue = isMonth.value * 300;
    console.log(
      "animatedStyle - isMonth.value:",
      isMonth.value,
      "heightValue:",
      heightValue
    );
    return {
      height: heightValue, // 1일 때 500, 0일 때 200
      overflow: "hidden",
    };
  });

  return (
    <SafeAreaView>
      <Animated.View style={[styles.container, animatedStyle]}>
        <CalendarHeader
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <CalendarWeekdays />
        <CalendarBody
          matrix={matrix}
          today={today}
          year={year}
          month={month}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-1000, 1000]}
      >
        <Animated.View style={styles.dragHandleWrapper}>
          <View style={styles.dragHandle} />
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dragHandleWrapper: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  dragHandle: {
    width: 100,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d0d0d0",
  },
});

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = firstDay.getDay();

  const matrix: Array<
    Array<{ day: number; type: "prev" | "current" | "next" }>
  > = [];
  let week: Array<{ day: number; type: "prev" | "current" | "next" }> = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push({ day: daysInPrevMonth - firstDayOfWeek + i + 1, type: "prev" });
  }

  [
    ...BASE_DAYS,
    ...Array.from({ length: daysInMonth - 28 }, (_, i) => i + 29),
  ].forEach((d) => {
    if (d > daysInMonth) return;
    week.push({ day: d, type: "current" });
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    let nextDay = 1;
    while (week.length < 7) {
      week.push({ day: nextDay++, type: "next" });
    }
    matrix.push(week);
  }

  return matrix;
}

function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={headerStyles.header}>
      <TouchableOpacity onPress={onPrev} style={headerStyles.arrowBtn}>
        <Text style={headerStyles.arrow}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={headerStyles.headerText}>
        {new Date(year, month).toLocaleString("en-US", { month: "long" })}{" "}
        {year}
      </Text>
      <TouchableOpacity onPress={onNext} style={headerStyles.arrowBtn}>
        <Text style={headerStyles.arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const headerStyles = StyleSheet.create({
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

function CalendarWeekdays() {
  return (
    <View style={weekdaysStyles.weekRow}>
      {WEEKDAYS.map((d, i) => (
        <Text
          key={d}
          style={[
            weekdaysStyles.weekday,
            i === 0 && weekdaysStyles.sun,
            i === 6 && weekdaysStyles.sat,
          ]}
        >
          {d}
        </Text>
      ))}
    </View>
  );
}

const weekdaysStyles = StyleSheet.create({
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

function CalendarBody({
  matrix,
  today,
  year,
  month,
  selectedDate,
  setSelectedDate,
}: {
  matrix: Array<Array<{ day: number; type: "prev" | "current" | "next" }>>;
  today: Date;
  year: number;
  month: number;
  selectedDate: { year: number; month: number; day: number } | null;
  setSelectedDate: (
    date: { year: number; month: number; day: number } | null
  ) => void;
}) {
  return (
    <>
      {matrix.map((week, i) => (
        <View key={i} style={bodyStyles.weekRow}>
          {week.map((cell, j) => {
            // 선택된 날짜 판별
            const isSelected =
              selectedDate &&
              cell.type === "current" &&
              selectedDate.year === year &&
              selectedDate.month === month &&
              selectedDate.day === cell.day;
            // 선택 스타일만 적용 (오늘 스타일 제거)
            const mergedStyle = [
              bodyStyles.day,
              cell.type === "current" && bodyStyles.currentDay,
              (cell.type === "prev" || cell.type === "next") &&
                bodyStyles.otherMonth,
              j === 0 &&
                (cell.type === "current"
                  ? bodyStyles.sun
                  : bodyStyles.otherMonthSun),
              j === 6 && bodyStyles.sat,
              isSelected && bodyStyles.selectedDayText,
            ];
            return (
              <View key={j} style={bodyStyles.dayCell}>
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
                        setSelectedDate(null); // 같은 날 다시 클릭 시 선택 해제
                      } else {
                        setSelectedDate({ year, month, day: cell.day });
                      }
                    }
                  }}
                  style={isSelected ? bodyStyles.selectedDay : undefined}
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

const bodyStyles = StyleSheet.create({
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
    borderRadius: 19, // 완전한 원
    borderColor: "#1976d2",
    borderWidth: 2,
    backgroundColor: "transparent", // 배경색 제거
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
