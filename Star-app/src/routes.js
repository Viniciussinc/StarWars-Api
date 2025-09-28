import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Main from "./pages/main";
import Login from "./pages/login";
import User from "./pages/user";
import Cadastro from "./pages/cadastro"

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{
            title: "LOGIN",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
              borderBottomWidth: 2,
              borderBottomColor: "#FFD700",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "#FFD700",
              fontSize: 18,
              letterSpacing: 2,
            },
          }}
        />
        <Stack.Screen
          name="main"
          component={Main}
          options={{
            title: "STAR WARS CARDS",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
              borderBottomWidth: 2,
              borderBottomColor: "#FFD700",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "#FFD700",
              fontSize: 18,
              letterSpacing: 2,
            },
          }}
        />
        <Stack.Screen
          name="user"
          component={User}
          options={{
            title: "Detalhes do Personagem",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
              borderBottomWidth: 2,
              borderBottomColor: "#FFD700",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "#FFD700",
              fontSize: 16,
              letterSpacing: 1,
            },
          }}
        />
        <Stack.Screen
          name="cadastro"
          component={Cadastro}
          options={{
            title: "Cadastro de Usuários",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000",
              borderBottomWidth: 2,
              borderBottomColor: "#FFD700",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "#FFD700",
              fontSize: 16,
              letterSpacing: 1,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
