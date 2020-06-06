import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import styles from './styles';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
         axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });

    }, [selectedUf]);

    function handleNavigateToPoints() {
        navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368}}
                
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrem pontos de coleta de forma eficiente.</Text>
                </View>

                <View style={styles.footer}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma UF...',
                            value: 0
                        }}
                        Icon={() => (<Icon name="chevron-down" color="#ccc" size={20} style={{ marginTop: 20, marginRight: 17 }} />)}
                        useNativeAndroidPickerStyle={false}
                        style={selectStyles}
                        onValueChange={(value) => setSelectedUf(value)}
                        items={ufs.map(uf => (
                            {
                                label: uf,
                                value: uf
                            }
                        ))}
                    />
                    <RNPickerSelect
                        placeholder={{
                            label: 'Selecione uma Cidade...',
                            value: 0
                        }}
                        Icon={() => (<Icon name="chevron-down" color="#ccc" size={20} style={{ marginTop: 20, marginRight: 17 }} />)}
                        useNativeAndroidPickerStyle={false}
                        style={selectStyles}
                        onValueChange={(value) => setSelectedCity(value)}
                        items={cities.map(city => (
                            {
                                label: city,
                                value: city
                            }
                        ))}
                    />
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text><Icon name="arrow-right" color="#FFF" size={24} /></Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>

            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const selectStyles = {
    inputIOS: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    inputAndroid: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    }
}

export default Home;