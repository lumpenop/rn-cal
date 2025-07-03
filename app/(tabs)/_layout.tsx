import Colors from "@/constants/Colors";
import { Tabs } from "expo-router";
import { Home, Calendar, BookOpen, User } from "lucide-react-native";

function TabBarIcon({
  Icon,
  color,
}: {
  Icon: React.ElementType;
  color: string;
}) {
  return (
    <Icon
      color={color}
      size={28}
      style={{
        marginBottom: 6,
        paddingTop: 3,
        alignSelf: "center",
      }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIconStyle: { paddingTop: 2 },
        tabBarStyle: {
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <TabBarIcon Icon={Calendar} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <TabBarIcon Icon={BookOpen} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "My Page",
          tabBarIcon: ({ color }) => <TabBarIcon Icon={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
