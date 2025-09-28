import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default class Cadastro extends Component {
  state = {
    nome: "",
    telefone: "",
    cpf: "",
    email: "",
    curso: "",
    password: "",
  };

  handleCadastro = async () => {
    const { nome, telefone, cpf, email, curso, password } = this.state;
    if (!nome || !telefone || !cpf || !email || !curso || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    const user = {
      nome,
      telefone,
      cpf,
      email,
      curso,
      password,
    };

    await AsyncStorage.setItem("user", JSON.stringify(user));
    alert("Usuário cadastrado com sucesso!");
    this.props.navigation.navigate("login");
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#B8860B"
          value={this.state.nome}
          onChangeText={(nome) => this.setState({ nome })}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#B8860B"
          value={this.state.telefone}
          onChangeText={(telefone) => this.setState({ telefone })}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#B8860B"
          value={this.state.cpf}
          onChangeText={(cpf) => this.setState({ cpf })}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#B8860B"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="Curso"
          placeholderTextColor="#B8860B"
          value={this.state.curso}
          onChangeText={(curso) => this.setState({ curso })}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#B8860B"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleCadastro}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    width: "85%",
    backgroundColor: "#0f0f23",
    color: "#FFD700",
    fontSize: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    padding: 15,
    width: "85%",
    alignItems: "center",
    marginVertical: 15,
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
