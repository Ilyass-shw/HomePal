import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  return (
    <>
      <SplashScreen />
      <StatusBar style="light" />
    </>
  );
}
