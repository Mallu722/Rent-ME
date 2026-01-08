import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import CompanionsScreen from '../screens/CompanionsScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CompanionDetailScreen from '../screens/CompanionDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ReviewScreen from '../screens/ReviewScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CompanionProfileScreen from '../screens/companion/CompanionProfileScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CompanionDetail" component={CompanionDetailScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="Review" component={ReviewScreen} />
  </Stack.Navigator>
);

const CompanionsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CompanionsMain" component={CompanionsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CompanionDetail" component={CompanionDetailScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
  </Stack.Navigator>
);

const BookingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="BookingsMain" component={BookingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookingDetail" component={BookingScreen} />
    <Stack.Screen name="Review" component={ReviewScreen} />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatList" component={ChatListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="CompanionProfile" component={CompanionProfileScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Companions" component={CompanionsStack} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
