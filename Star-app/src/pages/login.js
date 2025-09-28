import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem("user")
    if(!user){
      alert("Nenhum usuário cadastrado")
      return
    }
    const userJson = JSON.parse(user)
    if((userJson.email === usuario || userJson.nome === usuario) && userJson.password === password){
      navigation.navigate("main")
    }else{
      alert("Usuário ou senha inválidos!")
    }
  };

  const handleCadastro = () => {
    navigation.navigate('cadastro')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STAR WARS</Text>
      <Text style={styles.subtitle}>Personagens</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#B8860B"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#B8860B"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>CADASTRAR USUÁRIO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    backgroundImage: "linear-gradient(135deg, #000 0%, #1a1a2e 50%, #16213e 100%)",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
    textShadowColor: "#FFA500",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#C0C0C0",
    marginBottom: 40,
    letterSpacing: 2,
  },
  input: {
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 15,
    marginVertical: 12,
    width: "85%",
    backgroundColor: "#0f0f23",
    color: "#FFD700",
    fontSize: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 15,
    marginVertical: 12,
    width: "85%",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default Login;