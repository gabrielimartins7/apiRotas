import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FeedScreen from "../../screens/Private/Feed";

const { Navigator, Screen } = createStackNavigator();

import api from '../../http/api'

export default function FeedRoutes() {

  async function loadFarms(){
    const response = await api.get('/farms');
    console.log("teste", response.data.data);
  }

  useEffect(() => {
    loadFarms();
  },[])

  return (
    <Navigator
      initialRouteName="Feed"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#f2f3f5" },
      }}
    >
      <Screen name="Feed" component={FeedScreen} />
    </Navigator>
  );
}
