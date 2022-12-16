import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   ActivityIndicator
} from 'react-native';

import Load from '../components/Load';
import Header from '../components/Header';
import PlantCardPrimary from '../components/PlantCardPrimary';

import api from '../services/api';

import { PlantProps } from '../libs/storage';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import { useNavigation} from '@react-navigation/core';

export default function PlantSelect() {
   const [plants, setPlants] = useState<PlantProps[]>([]);
   const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
   const [loading, setLoading] = useState(true);

   const [page, setPage] = useState(1);
   const [loadingMore, setLoadingMore] = useState(false);

   const navigation = useNavigation();


   async function fetchPlants() {
      const { data } = await api.
      get(`plants?_sort=name&_order=asc&_page=${page}&_limit=16`);

      if (!data)
         return setLoading(true);

      if (page > 1) {
         setPlants(oldValue => [...oldValue, ...data]);
         setFilteredPlants(oldValue => [...oldValue, ...data]);
      } else {
         setPlants(data);
         setFilteredPlants(data);
      }

      setLoading(false);
      setLoadingMore(false);
   }

   function handleFetchMore(distance: number) {
      if (distance < 1)
         return;

      setLoadingMore(true);
      setPage(oldValue => oldValue + 1);
      fetchPlants();
   }

   function handlePlantSelect(plant: PlantProps) {
      navigation.navigate('PlantSave', { plant })
   }

   useEffect(() => {
      fetchPlants();
   }, []);

   if (loading)
      return <Load />

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Header/>
            <Text style={styles.title}>
               Selecione a espécie de sua planta:
            </Text>
         </View>

         <View style={styles.plants}>
            <FlatList
               data={filteredPlants}
               keyExtractor={(item) => String(item.id)}
               renderItem={({ item }) => (
                  <PlantCardPrimary
                     data={item}
                     onPress={() => handlePlantSelect(item)}
                  />
               )}
               showsVerticalScrollIndicator={false}
               numColumns={2}
               onEndReachedThreshold={0.1}
               onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
               ListFooterComponent={
                  loadingMore
                  ? <ActivityIndicator color={colors.green}/>
                  : <></>
               }
            />
         </View>

      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.background
   },
   header: {
      paddingHorizontal: 30
   },
   title: {
      fontSize: 17,
      color: colors.heading,
      fontFamily: fonts.text,
      lineHeight: 20,
      marginTop: 5,
      marginBottom: 20
   },
   plants: {
      flex: 1,
      paddingHorizontal: 32,
      justifyContent: 'center'
   }
});