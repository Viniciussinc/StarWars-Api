// ===================================================================
// TELA DE DETALHES DO PERSONAGEM
// ===================================================================
// Exibe informações completas sobre um personagem específico do Star Wars
// Carrega dados relacionados como filmes, espécies, veículos e naves

import React, { Component } from "react";
import {
  View,              // Container básico
  Text,              // Componente de texto
  StyleSheet,        // Sistema de estilos
  ActivityIndicator, // Indicador de carregamento
  ScrollView,        // Container rolável
  Image,             // Componente de imagem
  Platform           // Detecção de plataforma para estilos condicionais
} from "react-native";
import api from "../services/api"; // Configuração da API SWAPI

// ===================================================================
// COMPONENTE DE IMAGEM COM FALLBACK PARA DETALHES
// ===================================================================
// Reutilização do componente de imagem da tela principal
// Garante que a imagem seja exibida mesmo se a URL principal falhar
class CharacterImage extends Component {
  state = {
    currentImageIndex: 0, // Índice da URL atual sendo tentada
    imageError: false    // Flag para todas as URLs falharem
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
          <Text style={{ color: '#FFD700', fontSize: 18, textAlign: 'center' }}>⭐ {character.name} ⭐</Text>
        </View>
      );
    }

    return (
      <Image 
        source={{ uri: imageUrls[currentImageIndex] }}
        style={style}
        onError={this.handleImageError}
        onLoad={() => console.log(`Imagem de detalhes carregada: ${character.name}`)}
      />
    );
  }
}

// ===================================================================
// COMPONENTE PRINCIPAL DA TELA DE DETALHES
// ===================================================================
// Recebe dados do personagem via navegação e carrega informações relacionadas
export default class User extends Component {
  state = {
    character: {},   // Dados básicos do personagem
    films: [],       // Array de filmes em que aparece
    species: [],     // Array de espécies relacionadas
    vehicles: [],    // Array de veículos utilizados
    starships: [],   // Array de naves espaciais
    loading: true,   // Estado de carregamento
  };

  // Método chamado quando o componente é montado
  async componentDidMount() {
    try {
      // Recebe dados do personagem passados via navegação
      const { character } = this.props.route.params;
      console.log("Character received in User component:", character);
      
      // Validação de segurança
      if (!character) {
        console.error("No character data received!");
        this.setState({ loading: false });
        return;
      }
      
      // Define personagem no estado local
      this.setState({ character });
      
      // Carrega dados relacionados de forma assíncrona
      await this.loadRelatedData(character);
    } catch (error) {
      console.error("Error in User componentDidMount:", error);
      this.setState({ loading: false });
    }
  }

  // Carrega dados relacionados do personagem de forma assíncrona
  loadRelatedData = async (character) => {
    try {
      console.log("Loading related data for character:", character.name);
      
      // Inicializa arrays vazios para cada tipo de dados
      // Isso evita erros caso alguma requisição falhe
      let films = [];     // Filmes em que o personagem aparece
      let species = [];   // Espécies do personagem
      let vehicles = [];  // Veículos utilizados
      let starships = []; // Naves espaciais

      // CARREGAMENTO DE FILMES
      // Verifica se o personagem tem filmes associados
      if (character.films && character.films.length > 0) {
        try {
          // Cria array de promises para requisições paralelas
          const filmPromises = character.films.map(url => 
            api.get(url.replace('https://swapi.dev/api/', '')) // Remove base URL
          );
          // Aguarda todas as requisições terminarem
          const filmResponses = await Promise.all(filmPromises);
          // Extrai apenas os dados de cada resposta
          films = filmResponses.map(response => response.data);
          console.log("Films loaded:", films.length);
        } catch (error) {
          console.error("Error loading films:", error);
          // Continua mesmo se filmes falharem
        }
      }

      // Carregar espécies (se existirem)
      if (character.species && character.species.length > 0) {
        try {
          const speciesPromises = character.species.map(url => 
            api.get(url.replace('https://swapi.dev/api/', ''))
          );
          const speciesResponses = await Promise.all(speciesPromises);
          species = speciesResponses.map(response => response.data);
          console.log("Species loaded:", species.length);
        } catch (error) {
          console.error("Error loading species:", error);
        }
      }

      // Carregar veículos (se existirem)
      if (character.vehicles && character.vehicles.length > 0) {
        try {
          const vehiclePromises = character.vehicles.map(url => 
            api.get(url.replace('https://swapi.dev/api/', ''))
          );
          const vehicleResponses = await Promise.all(vehiclePromises);
          vehicles = vehicleResponses.map(response => response.data);
          console.log("Vehicles loaded:", vehicles.length);
        } catch (error) {
          console.error("Error loading vehicles:", error);
        }
      }

      // Carregar naves (se existirem)
      if (character.starships && character.starships.length > 0) {
        try {
          const starshipPromises = character.starships.map(url => 
            api.get(url.replace('https://swapi.dev/api/', ''))
          );
          const starshipResponses = await Promise.all(starshipPromises);
          starships = starshipResponses.map(response => response.data);
          console.log("Starships loaded:", starships.length);
        } catch (error) {
          console.error("Error loading starships:", error);
        }
      }

      this.setState({
        films,
        species,
        vehicles,
        starships,
        loading: false,
      });
    } catch (error) {
      console.log("Erro ao carregar dados relacionados:", error);
      this.setState({ loading: false });
    }
  };

  // Função helper para renderizar seções dinamicamente
  renderSection = (title, items, renderItem) => {
    // Não renderiza se não há itens para mostrar
    if (items.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {/* Mapeia cada item usando a função de renderização fornecida */}
        {items.map((item, index) => (
          <View key={index} style={styles.sectionItem}>
            {renderItem(item)} {/* Chama função personalizada para cada item */}
          </View>
        ))}
      </View>
    );
  };

  // Método principal de renderização
  render() {
    // Desestruturação do estado para facilitar acesso
    const { character, films, species, vehicles, starships, loading } = this.state;

    // ESTADO DE CARREGAMENTO
    // Exibe indicador enquanto dados estão sendo carregados
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando dados da galáxia...</Text>
        </View>
      );
    }

    // ESTADO DE ERRO
    // Exibe erro se dados do personagem não foram recebidos
    if (!character || !character.name) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>❌ Erro ao carregar personagem</Text>
        </View>
      );
    }

    // ===================================================================
    // CONFIGURAÇÃO CONDICIONAL PARA DIFERENTES PLATAFORMAS
    // ===================================================================
    // Define propriedades diferentes para web e mobile para otimizar scroll
    const isWeb = Platform.OS === 'web';
    
    const scrollViewProps = isWeb ? {
      // Configuração específica para Web (React Native Web)
      style: [styles.scrollViewStyle, { 
        overflow: 'scroll',              // CSS overflow para web
        WebkitOverflowScrolling: 'touch', // Scroll suave no iOS/Safari
        height: '100vh'                  // Altura da viewport
      }],
      contentContainerStyle: [styles.contentContainer, {
        minHeight: 'auto',    // Remove altura fixa no web
        paddingBottom: 150    // Espaço no final
      }]
    } : {
      // Configuração padrão para Mobile (iOS/Android)
      style: styles.scrollViewStyle,
      contentContainerStyle: styles.contentContainer
    };

    return (
      <View style={styles.container}>
        <ScrollView 
          {...scrollViewProps}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          bounces={false}
          nestedScrollEnabled={true}
        >
        {/* ===================================================================
            SEÇÃO DA IMAGEM PRINCIPAL
            =================================================================== */}
        {/* Container com imagem e overlay do nome */}
        <View style={styles.imageContainer}>
          <CharacterImage 
            character={character}
            style={styles.characterImage}
          />
          {/* Overlay com o nome do personagem sobreposto na imagem */}
          <View style={styles.imageOverlay}>
            <Text style={styles.characterName}>{character.name}</Text>
          </View>
        </View>

        {/* ===================================================================
            SEÇÃO DE INFORMAÇÕES FÍSICAS
            =================================================================== */}
        {/* Card com dados básicos do personagem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Informações Físicas</Text>
          <View style={styles.infoGrid}>
            {/* Dados extraídos diretamente da SWAPI */}
            <Text style={styles.infoText}>⚡ Altura: {character.height}cm</Text>
            <Text style={styles.infoText}>⚖️ Peso: {character.mass}kg</Text>
            <Text style={styles.infoText}>👁️ Cor dos Olhos: {character.eye_color}</Text>
            <Text style={styles.infoText}>💇 Cor do Cabelo: {character.hair_color}</Text>
            <Text style={styles.infoText}>👤 Cor da Pele: {character.skin_color}</Text>
            <Text style={styles.infoText}>🎂 Nascimento: {character.birth_year}</Text>
            <Text style={styles.infoText}>👥 Gênero: {character.gender}</Text>
          </View>
        </View>

        {/* ===================================================================
            SEÇÕES DINÂMICAS DE DADOS RELACIONADOS
            =================================================================== */}
        
        {/* FILMES - Renderiza apenas se personagem tem filmes */}
        {this.renderSection("🎬 Filmes", films, (film) => (
          <Text style={styles.itemText}>• {film.title} ({film.release_date})</Text>
        ))}

        {/* ESPÉCIES - Informações sobre a espécie do personagem */}
        {this.renderSection("👽 Espécies", species, (specie) => (
          <View>
            <Text style={styles.itemText}>• {specie.name}</Text>
            <Text style={styles.subItemText}>  Classificação: {specie.classification}</Text>
            <Text style={styles.subItemText}>  Linguagem: {specie.language}</Text>
          </View>
        ))}

        {/* VEÍCULOS - Transporte terrestre utilizado */}
        {this.renderSection("🚗 Veículos", vehicles, (vehicle) => (
          <View>
            <Text style={styles.itemText}>• {vehicle.name}</Text>
            <Text style={styles.subItemText}>  Modelo: {vehicle.model}</Text>
            <Text style={styles.subItemText}>  Fabricante: {vehicle.manufacturer}</Text>
          </View>
        ))}

        {/* NAVES ESPACIAIS - Transporte espacial utilizado */}
        {this.renderSection("🚀 Naves Espaciais", starships, (starship) => (
          <View>
            <Text style={styles.itemText}>• {starship.name}</Text>
            <Text style={styles.subItemText}>  Modelo: {starship.model}</Text>
            <Text style={styles.subItemText}>  Classe: {starship.starship_class}</Text>
            <Text style={styles.subItemText}>  Fabricante: {starship.manufacturer}</Text>
          </View>
        ))}

        {/* ===================================================================
            SEÇÃO INFORMATIVA SOBRE A API
            =================================================================== */}
        {/* Seção adicional que garante conteúdo suficiente para scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Sobre o Personagem</Text>
          <Text style={styles.infoText}>
            Este personagem faz parte do universo Star Wars, uma das sagas mais famosas do cinema. 
            Os dados são obtidos da SWAPI (Star Wars API), que contém informações detalhadas 
            sobre personagens, planetas, naves e muito mais da galáxia muito, muito distante.
          </Text>
        </View>

        {/* Espaço extra no final para garantir scroll completo */}
        <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }
}

// ===================================================================
// ESTILOS TEMÁTICOS STAR WARS
// ===================================================================
// Paleta de cores: Preto espacial, Dourado Star Wars, Prata
const styles = StyleSheet.create({
  // Container principal com estilos condicionais para web/mobile
  container: {
    flex: 1,
    backgroundColor: '#000', // Preto espacial
    // Estilos específicos para web (React Native Web)
    ...(Platform.OS === 'web' && {
      height: '100vh',        // Altura da viewport
      maxHeight: '100vh',     // Altura máxima
      overflow: 'hidden'      // Esconde overflow no container pai
    })
  },
  
  // ScrollView interno para controle de rolagem
  scrollViewStyle: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  // Container do conteúdo com padding e altura mínima
  contentContainer: {
    paddingBottom: 150,
    // Altura mínima condicional para garantir scroll
    ...(Platform.OS === 'web' && {
      minHeight: '150vh'
    })
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    marginBottom: 20,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 2,
    // Removido textShadow* props para compatibilidade web
    textShadow: '2px 2px 4px #FFA500',
  },
  // Cards das seções com tema espacial
  section: {
    backgroundColor: '#0f0f23',  // Azul escuro espacial
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,            // Bordas arredondadas
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD700',      // Borda dourada Star Wars
    // BoxShadow para web (substitui elevation do mobile)
    boxShadow: '0px 3px 6px rgba(255, 215, 0, 0.3)',
  },
  
  // Títulos das seções com efeito dourado
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',            // Dourado Star Wars
    marginBottom: 15,
    letterSpacing: 1,            // Espaçamento de letras futurista
    textAlign: 'center',
    // TextShadow para web (efeito de brilho)
    textShadow: '1px 1px 2px #FFA500',
  },
  infoGrid: {
    flexDirection: 'column',
  },
  infoText: {
    fontSize: 16,
    color: '#C0C0C0',
    marginBottom: 8,
    paddingLeft: 10,
    lineHeight: 24,
  },
  sectionItem: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#C0C0C0',
    fontWeight: '500',
    lineHeight: 22,
  },
  subItemText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 4,
    lineHeight: 20,
  },
});