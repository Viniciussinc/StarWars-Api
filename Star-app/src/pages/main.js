// ===================================================================
// TELA PRINCIPAL - LISTA DE PERSONAGENS STAR WARS
// ===================================================================
// Esta tela exibe uma lista de personagens do Star Wars obtidos da SWAPI
// Permite adicionar novos personagens aleatórios e navegar para detalhes

import React, { Component } from "react";
import {
  View,          // Container básico
  Text,          // Componente de texto
  FlatList,      // Lista otimizada para grandes datasets
  TouchableOpacity, // Botão tocável
  StyleSheet,    // Sistema de estilos
  ActivityIndicator, // Indicador de carregamento
  Alert,         // Alertas nativos
  Image,         // Componente de imagem
  Platform       // Detecção de plataforma (iOS/Android/Web)
} from "react-native";
import api from "../services/api"; // Configuração da API SWAPI

// ===================================================================
// COMPONENTE DE IMAGEM COM FALLBACK
// ===================================================================
// Este componente tenta carregar imagens de múltiplas fontes
// Se uma falhar, automaticamente tenta a próxima fonte disponível
class CharacterImage extends Component {
  state = {
    currentImageIndex: 0, // Índice da URL atual sendo tentada
    imageError: false    // Flag para indicar se todas as URLs falharam
  };

  // Retorna array de URLs de imagem em ordem de prioridade
  getImageUrls = (character) => {
    const id = character.id;
    const name = encodeURIComponent(character.name.replace(/\s+/g, '+'));
    
    return [
      // 1ª opção: Star Wars Visual Guide (melhor qualidade)
      `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`,
      // 2ª opção: Galeria alternativa
      `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`,
      // 3ª opção: Placeholder personalizado com nome do personagem
      `https://via.placeholder.com/300x400/1a1a2e/FFD700?text=${name}`,
    ];
  };

  // Chamada quando uma imagem falha ao carregar
  handleImageError = () => {
    const { currentImageIndex } = this.state;
    const imageUrls = this.getImageUrls(this.props.character);
    
    // Se ainda há URLs para tentar, vai para a próxima
    if (currentImageIndex < imageUrls.length - 1) {
      this.setState({ currentImageIndex: currentImageIndex + 1 });
    } else {
      // Se todas falharam, mostra placeholder personalizado
      this.setState({ imageError: true });
    }
  };

  render() {
    const { character, style } = this.props;
    const { currentImageIndex, imageError } = this.state;
    const imageUrls = this.getImageUrls(character);

    if (imageError) {
      return (
        <View style={[style, { backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#FFD700', fontSize: 16, textAlign: 'center' }}>⭐ {character.name} ⭐</Text>
        </View>
      );
    }

    return (
      <Image 
        source={{ uri: imageUrls[currentImageIndex] }}
        style={style}
        onError={this.handleImageError}
        onLoad={() => console.log(`Imagem carregada: ${character.name}`)}
      />
    );
  }
}

// ===================================================================
// COMPONENTE PRINCIPAL DA TELA
// ===================================================================
// Gerencia o estado da aplicação e interações do usuário
export default class Main extends Component {
  state = {
    characters: [], // Array de personagens carregados da API
    loading: false, // Flag de carregamento para UX
  };

  async componentDidMount() {
    this.loadCharacters();
  }

  // Carrega os primeiros 10 personagens da SWAPI
  loadCharacters = async () => {
    this.setState({ loading: true }); // Mostra indicador de carregamento
    try {
      // Faz requisição para a API do Star Wars
      const response = await api.get("people/");
      
      // Adiciona ID baseado na posição para cada personagem
      const charactersWithId = response.data.results.map((character, index) => ({
        ...character,        // Spread dos dados originais da API
        id: index + 1       // ID incremental para identificação única
      }));
      
      // Atualiza o estado com os personagens carregados
      this.setState({ characters: charactersWithId });
    } catch (error) {
      // Tratamento de erro com feedback para o usuário
      Alert.alert("Erro", "Não foi possível carregar os personagens da galáxia");
      console.log("Erro ao buscar personagens:", error);
    }
    this.setState({ loading: false }); // Esconde indicador de carregamento
  };

  // Adiciona um personagem aleatório da SWAPI
  addRandomCharacter = async () => {
    this.setState({ loading: true });
    try {
      // Gera ID aleatório (SWAPI tem aproximadamente 83 personagens)
      const randomId = Math.floor(Math.random() * 83) + 1;
      
      // Busca personagem específico por ID
      const response = await api.get(`people/${randomId}/`);
      const newCharacter = {
        ...response.data, // Dados do personagem da API
        id: randomId     // ID para identificação
      };

      // Verifica se o personagem já foi adicionado à lista
      const exists = this.state.characters.some(char => char.id === randomId);
      if (!exists) {
        // Adiciona ao estado usando spread operator para imutabilidade
        this.setState(prevState => ({
          characters: [...prevState.characters, newCharacter]
        }));
      } else {
        Alert.alert("Aviso", "Este personagem já está na lista!");
      }
    } catch (error) {
      // Tratamento de erro para requisições que falham
      Alert.alert("Erro", "Não foi possível adicionar novo personagem");
      console.log("Erro ao buscar personagem:", error);
    }
    this.setState({ loading: false });
  };

  // Remove personagem da lista usando filter
  removeCharacter = (characterToRemove) => {
    // Cria nova array excluindo o personagem selecionado
    const updatedCharacters = this.state.characters.filter(
      character => character.id !== characterToRemove.id
    );
    // Atualiza estado com a lista filtrada
    this.setState({ characters: updatedCharacters });
  };

  // Navega para tela de detalhes do personagem
  navigateToDetails = (character) => {
    console.log("Navigating to details with character:", character);
    
    // Validações de segurança antes da navegação
    if (!character) {
      Alert.alert("Erro", "Dados do personagem não encontrados");
      return;
    }
    
    if (!this.props.navigation) {
      console.error("Navigation not available");
      return;
    }
    
    try {
      // Navega para tela "user" passando dados do personagem
      this.props.navigation.navigate("user", { character });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Erro", "Não foi possível navegar para os detalhes");
    }
  };

  renderCharacter = ({ item: character }) => (
    <View style={styles.characterCard}>
      {/* Container da Imagem */}
      <View style={styles.imageContainer}>
        <CharacterImage 
          character={character}
          style={styles.characterImage}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.characterName}>{character.name}</Text>
        </View>
      </View>

      {/* Informações do Card */}
      <View style={styles.cardContent}>
        <Text style={styles.characterInfo}>⚡ Altura: {character.height}cm</Text>
        <Text style={styles.characterInfo}>⚖️ Peso: {character.mass}kg</Text>
        <Text style={styles.characterInfo}>👁️ Olhos: {character.eye_color}</Text>
        <Text style={styles.characterInfo}>👤 Gênero: {character.gender}</Text>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => this.navigateToDetails(character)}
          >
            <Text style={styles.buttonText}>Ver Detalhes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => this.removeCharacter(character)}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  render() {
    const { characters, loading } = this.state;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🌟 PERSONAGENS STAR WARS 🌟</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={this.addRandomCharacter}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? "Carregando..." : "+ ADICIONAR PERSONAGEM"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Personagens */}
        {loading && characters.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Carregando dados da galáxia...</Text>
          </View>
        ) : (
          <FlatList
            data={characters}
            renderItem={this.renderCharacter}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            style={{ flex: 1 }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    ...(Platform.OS === 'web' && {
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    })
  },
  header: {
    backgroundColor: '#0f0f23',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    letterSpacing: 2,
    textAlign: 'center',
    // Removido textShadow* props para compatibilidade web
    textShadow: '2px 2px 4px #FFA500',
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    // Removido shadow* props para compatibilidade web
    boxShadow: '0px 4px 8px rgba(255, 215, 0, 0.3)',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 15,
    fontSize: 16,
    letterSpacing: 1,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
    ...(Platform.OS === 'web' && {
      minHeight: '150vh'
    })
  },
  characterCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
    // Removido elevation e shadow* para compatibilidade web
    boxShadow: '0px 6px 12px rgba(255, 215, 0, 0.2)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 1,
    // Removido textShadow* props para compatibilidade web
    textShadow: '1px 1px 2px #FFA500',
  },
  cardContent: {
    padding: 20,
  },
  characterInfo: {
    fontSize: 16,
    color: '#C0C0C0',
    marginBottom: 8,
    paddingLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  detailsButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  deleteButton: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});