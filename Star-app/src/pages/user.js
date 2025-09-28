import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";

export default class User extends Component {
  state = {
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    loading: true,
  };

  async componentDidMount() {
    const { route } = this.props;
    const { character } = route.params;

    this.loadAdditionalData(character);
  }

  loadAdditionalData = async (character) => {
    try {
      // Carregar filmes
      const filmsPromises = character.films.map(filmUrl =>
        api.get(filmUrl.replace('https://swapi.dev/api/', ''))
      );
      const filmsResponses = await Promise.all(filmsPromises);
      const films = filmsResponses.map(response => response.data);

      // Carregar espécies
      const speciesPromises = character.species.map(speciesUrl =>
        api.get(speciesUrl.replace('https://swapi.dev/api/', ''))
      );
      const speciesResponses = await Promise.all(speciesPromises);
      const species = speciesResponses.map(response => response.data);

      // Carregar veículos
      const vehiclesPromises = character.vehicles.map(vehicleUrl =>
        api.get(vehicleUrl.replace('https://swapi.dev/api/', ''))
      );
      const vehiclesResponses = await Promise.all(vehiclesPromises);
      const vehicles = vehiclesResponses.map(response => response.data);

      // Carregar naves
      const starshipsPromises = character.starships.map(starshipUrl =>
        api.get(starshipUrl.replace('https://swapi.dev/api/', ''))
      );
      const starshipsResponses = await Promise.all(starshipsPromises);
      const starships = starshipsResponses.map(response => response.data);

      this.setState({
        films,
        species,
        vehicles,
        starships,
        loading: false,
      });
    } catch (error) {
      console.log("Erro ao carregar dados adicionais:", error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { route } = this.props;
    const { character } = route.params;
    const { films, species, vehicles, starships, loading } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: character.image,
            }}
            style={styles.characterImage}
            defaultSource={{ uri: 'https://via.placeholder.com/200x250/cccccc/666666?text=No+Image' }}
          />
          <Text style={styles.characterName}>{character.name}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Físicas</Text>
            <Text style={styles.detailText}>Altura: {character.height}cm</Text>
            <Text style={styles.detailText}>Peso: {character.mass}kg</Text>
            <Text style={styles.detailText}>Cor dos cabelos: {character.hair_color}</Text>
            <Text style={styles.detailText}>Cor da pele: {character.skin_color}</Text>
            <Text style={styles.detailText}>Cor dos olhos: {character.eye_color}</Text>
            <Text style={styles.detailText}>Ano de nascimento: {character.birth_year}</Text>
            <Text style={styles.detailText}>Gênero: {character.gender}</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>Carregando dados da galáxia...</Text>
            </View>
          ) : (
            <>
              {films.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Filmes</Text>
                  {films.map((film, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.itemTitle}>{film.title}</Text>
                      <Text style={styles.itemSubtitle}>Episódio {film.episode_id}</Text>
                      <Text style={styles.itemDescription}>{film.opening_crawl.substring(0, 150)}...</Text>
                    </View>
                  ))}
                </View>
              )}

              {species.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Espécies</Text>
                  {species.map((specie, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.itemTitle}>{specie.name}</Text>
                      <Text style={styles.itemDescription}>Classificação: {specie.classification}</Text>
                      <Text style={styles.itemDescription}>Linguagem: {specie.language}</Text>
                    </View>
                  ))}
                </View>
              )}

              {vehicles.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Veículos</Text>
                  {vehicles.map((vehicle, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.itemTitle}>{vehicle.name}</Text>
                      <Text style={styles.itemDescription}>Modelo: {vehicle.model}</Text>
                      <Text style={styles.itemDescription}>Fabricante: {vehicle.manufacturer}</Text>
                    </View>
                  ))}
                </View>
              )}

              {starships.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Naves Espaciais</Text>
                  {starships.map((starship, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.itemTitle}>{starship.name}</Text>
                      <Text style={styles.itemDescription}>Modelo: {starship.model}</Text>
                      <Text style={styles.itemDescription}>Fabricante: {starship.manufacturer}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#0f0f23',
    paddingVertical: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  characterImage: {
    width: 160,
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  detailsContainer: {
    padding: 15,
  },
  section: {
    backgroundColor: '#0f0f23',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFA500',
    paddingBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  detailText: {
    fontSize: 15,
    color: '#C0C0C0',
    marginBottom: 8,
    paddingLeft: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFD700',
    marginTop: 15,
    fontSize: 16,
    letterSpacing: 1,
  },
  listItem: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  itemSubtitle: {
    fontSize: 15,
    color: '#B8860B',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#C0C0C0',
    lineHeight: 18,
  },
});
