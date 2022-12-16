import React, { useEffect, useState } from 'react';
import {
   StyleSheet,
   Text,
   Image,
   View,
   TouchableOpacity,
   Alert
} from 'react-native';

import fonts from '../styles/fonts';
import colors from '../styles/colors';
import defaultImg from '../assets/anonymous.jpg';

import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
   const [username, setUsername] = useState<string>();
   const [userImg, setUserImg] = useState<any>();
   const [count, setCount] = useState(0);
   const [whenUserChangedName, setWhenUserChangedName] = useState(0);
   const navigation = useNavigation();

   async function pickImage() {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true
      })

      if (!result.cancelled) {
         await AsyncStorage.setItem('@mygarden:userImage', result.uri);
      }
   }

   useEffect(() => {
      const interval = setInterval(() => {
         setCount(() => count + 1);
      }, 5000);

      async function loadStorageUsernameAndUserImg() {
         const user = await AsyncStorage.getItem('@mygarden:user');
         const image = await AsyncStorage.getItem('@mygarden:userImage');
         setUsername(user || '');
         setUserImg(image || '');
      }
      loadStorageUsernameAndUserImg();

      const unsubscribe = navigation.addListener('focus', () => {
         setCount(0);
         setWhenUserChangedName(0);
      });

       return () => {
         clearTimeout(interval);
         unsubscribe;
       }
   }, [count])


   return (
      <View style={styles.container}>
         <View>
            <Text style={styles.greeting}>Olá,</Text>
            <TouchableOpacity onPress={() => {
               if (whenUserChangedName < count) {
                  Alert.alert('Nome do usuário', "Você quer mudar o seu nome?", [
                     {
                        text: 'Não',
                        style: 'cancel'
                     },
                     {
                        text: 'Sim',
                        onPress: async () => {
                           setWhenUserChangedName(count);
                           navigation.navigate('UserIdentification');
                        }
                     }
                  ]);
               } else {
                  Alert.alert('Muitas requisições!', 'Por favor, aguarde e tente novamente.');
               }

            }}>
               <Text style={styles.username}>{username}</Text>
            </TouchableOpacity>
         </View>
         <TouchableOpacity onPress={() => {
            if (whenUserChangedName < count) {
               Alert.alert('Foto de perfil', "Você quer mudar a sua foto de perfil?", [
                  {
                     text: 'Não',
                     style: 'cancel'
                  },
                  {
                     text: 'Sim',
                     onPress: () => {
                        setWhenUserChangedName(count);
                        pickImage();
                     }
                  }
               ]);
            } else {
               Alert.alert('Muitas requisições!', 'Aguarde e tente novamente.');
            }
         }}>
            { userImg ? (
               <Image source={{ uri: userImg }} style={styles.image} />
            ) : (
               <Image source={defaultImg} style={styles.image} />
            )}

         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      marginTop: getStatusBarHeight()
   },
   image: {
      width: 70,
      height: 70,
      borderRadius: 35
   },
   greeting: {
      fontSize: 32,
      color: colors.heading,
      fontFamily: fonts.text
   },
   username: {
      fontSize: 32,
      fontFamily: fonts.heading,
      color: colors.heading,
      lineHeight: 40
   }
});