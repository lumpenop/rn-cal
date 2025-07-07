import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarHeader from "../../components/calendar/CalendarHeader";
import CalendarWeekdays from "../../components/calendar/CalendarWeekdays";
import CalendarBody from "../../components/calendar/CalendarBody";
import { getMonthMatrix } from "../../components/calendar/utils";

export default function CalendarScreen() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const matrix = getMonthMatrix(year, month);
  const isMonth = useSharedValue(1);

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
      height: heightValue,
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
