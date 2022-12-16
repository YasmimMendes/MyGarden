import React, { useEffect, useState } from 'react';
import {
   StyleSheet,
   View,
   Text,
   Image,
   FlatList,
   Alert
} from 'react-native';

import Load from '../components/Load';
import Header from '../components/Header';
import PlantCardSecondary from '../components/PlantCardSecondary';

import { loadPlant, PlantProps, removePlant } from '../libs/storage';

import fonts from '../styles/fonts';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';

import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function MyPlants() {
   const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
   const [loading, setLoading] = useState(true);
   const [nextWatered, setNextWatered] = useState<string>();

   function handleRemove(plant: PlantProps) {
      Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
         {
            text: 'Não',
            style: 'cancel'
         },
         {
            text: 'Sim',
            onPress: async () => {
               try {
                  await removePlant(plant.id);
                  setMyPlants(oldData =>
                     oldData.filter(item => item.id !== plant.id)
                  );
               } catch (error) {
                  Alert.alert('Não foi possível remover!');
               }
            }
         }
      ]);
   }

   useEffect(() => {
      async function loadStorageData() {
         const plantsStoraged = await loadPlant();
         console.log(plantsStoraged);
         try {
            const nextTime = formatDistance(
               new Date(plantsStoraged[0].dateTimeNotification).getTime(),
               new Date().getTime(),
               { locale: pt }
            )

            setNextWatered(
               `Não esqueça de regar sua ${plantsStoraged[0].name} daqui a ${nextTime}.`
            )
         } catch {
            setNextWatered(
               'Ainda não há nenhuma planta para ser regada. Cadastre!'
            )
         }
         setMyPlants(plantsStoraged);
         setLoading(false);
      }
      loadStorageData();
   }, []);

   if (loading)
      return <Load />

   return (
      <View style={styles.container}>
         <Header />

         <View style={styles.spotlight}>
            <Image
               source={waterdrop}
               style={styles.spotlightImage}
            />
            <Text style={styles.spotlightText}>
               {nextWatered}
            </Text>
         </View>

         <View style={styles.plants}>
            <Text style={styles.plantsTitle}>
               Próximas regadas:
            </Text>

            <FlatList
               data={myPlants}
               keyExtractor={item => String(item.id)}
               renderItem={({ item }) => (
                  <PlantCardSecondary
                     data={item}
                     handleRemove={() => {handleRemove(item)}}
                  />
               )}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ flex: 1 }}
            />
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 30,
      paddingTop: 5,
      backgroundColor: colors.background
   },
   spotlight: {
      backgroundColor: colors.blue_light,
      paddingHorizontal: 20,
      borderRadius: 20,
      height: 90,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
   },
   spotlightImage: {
      width: 40,
      height: 40
   },
   spotlightText: {
      flex: 1,
      color: colors.blue,
      paddingHorizontal: 20,
      textAlign: 'justify'
   },
   plants: {
      flex: 1,
      width: '100%'
   },
   plantsTitle: {
      fontSize: 24,
      fontFamily: fonts.heading,
      color: colors.heading,
      marginVertical: 20
   },
});