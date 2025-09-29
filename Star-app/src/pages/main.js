import React, { Component } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { List } from '../styles';
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente para imagem com fallback
class CharacterImage extends Component {
  state = {
    currentImageIndex: 0,
    imageError: false
  };

  getImageUrls = (character) => {
    const id = character.id;
    const name = encodeURIComponent(character.name.replace(/\s+/g, '+'));
    
    return [
      `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`,
      `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`,
      `https://via.placeholder.com/300x400/1a1a2e/FFD700?text=${name}`,
    ];
  };

  handleImageError = () => {
    const { currentImageIndex } = this.state;
    const imageUrls = this.getImageUrls(this.props.character);
    
    if (currentImageIndex < imageUrls.length - 1) {
      this.setState({ currentImageIndex: currentImageIndex + 1 });
    } else {
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
          <Text style={{ color: '#FFD700', fontSize: 16 }}>⭐ {character.name} ⭐</Text>
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

export default class Main extends Component {
  state = {
    characters: [],
    loading: false,
    nextPage: null,
  };



  async componentDidMount() {
    this.loadCharacters();
    const savedCharacters = await AsyncStorage.getItem("starwars_characters");
    if (savedCharacters) {
      this.setState({ characters: JSON.parse(savedCharacters) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { characters } = this.state;
    if (prevState.characters !== characters) {
      AsyncStorage.setItem("starwars_characters", JSON.stringify(characters));
    }
  }

  loadCharacters = async () => {
    try {
      this.setState({ loading: true });
      const response = await api.get("people/");
      const charactersWithImages = response.data.results.map((character, index) => {
        const characterId = character.url.split('/').slice(-2, -1)[0];
        return {
          ...character,
          id: characterId,
        };
      });
      
      this.setState({
        characters: charactersWithImages,
        nextPage: response.data.next,
        loading: false,
      });
    } catch (error) {
      console.log("Erro ao carregar personagens:", error);
      this.setState({ loading: false });
      Alert.alert("Erro", "Não foi possível carregar os personagens");
    }
  };

  addRandomCharacter = async () => {
    try {
      this.setState({ loading: true });
      const randomId = Math.floor(Math.random() * 83) + 1; // SWAPI tem cerca de 83 personagens
      const response = await api.get(`people/${randomId}/`);
      
      const newCharacter = {
        ...response.data,
        id: randomId,
      };

      const { characters } = this.state;
      if (characters.find(char => char.id === newCharacter.id)) {
        Alert.alert("Aviso", "Este personagem já foi adicionado!");
        this.setState({ loading: false });
        return;
      }

      this.setState({
        characters: [...characters, newCharacter],
        loading: false,
      });
    } catch (error) {
      console.log("Erro ao adicionar personagem:", error);
      this.setState({ loading: false });
      Alert.alert("Erro", "Não foi possível adicionar o personagem");
    }
  };

  removeCharacter = (characterId) => {
    const { characters } = this.state;
    this.setState({
      characters: characters.filter(char => char.id !== characterId)
    });
  };

  renderCharacter = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <CharacterImage 
          character={item}
          style={styles.characterImage}
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.overlayText}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.characterInfo}>⚡ Altura: {item.height}cm</Text>
        <Text style={styles.characterInfo}>⚖️ Peso: {item.mass}kg</Text>
        <Text style={styles.characterInfo}>👁️ Olhos: {item.eye_color}</Text>
        <Text style={styles.characterInfo}>👤 Gênero: {item.gender}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.detailButton]}
            onPress={() => this.props.navigation.navigate("user", { character: item })}
          >
            <Text style={styles.buttonText}>Ver Mais Detalhes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]}
            onPress={() => this.removeCharacter(item.id)}
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={this.addRandomCharacter}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>
              {loading ? "Carregando..." : "ADD"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && characters.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Carregando personagens da galáxia...</Text>
          </View>
        ) : (
          <List
            data={characters}
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderCharacter}
            contentContainerStyle={styles.listContainer}
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
  },
  header: {
    padding: 15,
    backgroundColor: '#0f0f23',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  addButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 15,
    fontSize: 16,
    letterSpacing: 1,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: '#0f0f23',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD700',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  overlayText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  cardContent: {
    padding: 15,
  },
  characterName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  characterInfo: {
    fontSize: 14,
    color: '#C0C0C0',
    marginBottom: 6,
    paddingLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  detailButton: {
    backgroundColor: '#4169E1',
    borderWidth: 1,
    borderColor: '#6495ED',
    shadowColor: '#4169E1',
  },
  deleteButton: {
    backgroundColor: '#DC143C',
    borderWidth: 1,
    borderColor: '#FF6347',
    shadowColor: '#DC143C',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
