import React, { useEffect, useState } from 'react';
import { View, Image, ImageBackground, Text, Picker, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },

  inputText: {
    color: '#6C6C80',
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');

  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufInitials = response.data.map((ufInfo) => ufInfo.sigla);

        setUfs(ufInitials);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cityNames = response.data.map((cityInfo) => cityInfo.nome);

        setCities(cityNames);
      })
      .catch((error) => console.log(error));
  }, [selectedUf]);

  function handleNavigationToPoints() {
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  }

  function handleSelectUf(value: string) {
    setSelectedUf(value);
  }

  function handleSelectCity(value: string) {
    setSelectedCity(value);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ImageBackground
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>

        <View style={styles.footer}>
          <View>
            <View style={styles.input}>
              <Picker style={styles.inputText} selectedValue={selectedUf} onValueChange={handleSelectUf}>
                <Picker.Item label="Selecione um estado" value="0" />
                {ufs.sort().map((uf) => (
                  <Picker.Item key={uf} label={uf} value={uf} />
                ))}
              </Picker>
            </View>

            <View style={styles.input}>
              <Picker style={styles.inputText} selectedValue={selectedCity} onValueChange={handleSelectCity}>
                <Picker.Item label="Selecione uma cidade" value="0" />
                {cities.sort().map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>
          </View>

          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
