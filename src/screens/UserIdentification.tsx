import React, { useState } from 'react';
import {
   SafeAreaView,
   StyleSheet,
   Text,
   TextInput,
   View,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Platform,
   Keyboard,
   Alert
} from 'react-native';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import Button from '../components/Button';

import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserIdentification() {
   const [isFocused, setIsFocused] = useState(false);
   const [isFilled, setIsFilled] = useState(false);
   const [name, setName] = useState<string>();
   const navigation = useNavigation();

   function handleInputBlur() {
      setIsFocused(false);
      setIsFilled(!!name);
   }

   function handleInputFocus() {
      setIsFocused(true);
   }

   function handleInputChange(value: string) {
      setIsFilled(!!value);
      setName(value);

   }

   async function handleSubmit() {
      if (!name)
         return Alert.alert('Informe o seu nome.')

      try {
         await AsyncStorage.setItem('@mygarden:user', name);
         navigation.navigate("Confirmation", {
            title: 'Tudo pronto!',
            subtitle: 'A partir de agora, te ajudaremos a cuidar das suas plantinhas.',
            buttonTitle: 'Começar',
            nextScreen: 'PlantSelect',
            username: name,
         });
      } catch {
         return Alert.alert('Não foi possível salvar o seu nome. Tente novamente.')
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
         >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <View style={styles.content}>
                  <View style={styles.form}>
                     <View style={styles.header}>
                        <Text style={styles.title}>Qual o seu nome?</Text>
                        <TextInput
                           style={[
                              styles.input,
                              (isFocused || isFilled) &&
                              { borderColor: colors.green }
                           ]}
                           placeholder="Informe o seu nome"
                           onBlur={handleInputBlur}
                           onFocus={handleInputFocus}
                           onChangeText={handleInputChange}
                        />
                     </View>
                     <View style={styles.footer}>
                        <Button
                           title="Confirmar"
                           onPress={handleSubmit}
                        />
                     </View>
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around'
   },
   content: {
      flex: 1,
      width: '100%'
   },
   form: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 54,
      alignItems: 'center'
   },
   header: {
      alignItems: 'center',
      width: '100%'
   },
   input: {
      borderBottomWidth: 1,
      borderColor: colors.gray,
      color: colors.heading,
      width: '100%',
      fontSize: 18,
      marginTop: 15,
      padding: 10,
      textAlign: 'center'
   },
   title: {
      fontSize: 24,
      lineHeight: 32,
      textAlign: 'center',
      color: colors.heading,
      fontFamily: fonts.heading,
      marginTop: 20
   },
   footer: {
      width: '100%',
      marginTop: 40,
      paddingHorizontal: 20
   }
});