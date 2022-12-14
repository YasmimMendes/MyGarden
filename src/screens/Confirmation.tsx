import React from 'react';
import {
   SafeAreaView,
   StyleSheet,
   Text,
   View
} from 'react-native';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

import Button from '../components/Button';

import { useNavigation, useRoute } from '@react-navigation/core';

interface Params {
   title: string;
   subtitle: string;
   buttonTitle: string;
   nextScreen: string;
   username: string;
}

export default function Confirmation() {
   const navigation = useNavigation();
   const routes = useRoute();

   const {
      title,
      subtitle,
      buttonTitle,
      nextScreen,
      username
   } = routes.params as Params;

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <Text style={styles.title}>
               {title}
            </Text>

            <Text style={styles.subtitle}>
               {subtitle}
            </Text>
            <View style={styles.footer}>
               <Button
                  onPress={() => {navigation.navigate(nextScreen, {
                     username: username
                  })}}
                  title={buttonTitle}
               />
            </View>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around'
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: 30
   },
   title: {
      fontSize: 22,
      fontFamily: fonts.heading,
      textAlign: 'center',
      color: colors.heading,
      lineHeight: 38,
      marginTop: 15
   },
   subtitle: {
      fontFamily: fonts.text,
      textAlign: 'center',
      fontSize: 17,
      paddingVertical: 20
   },
   footer: {
      width: '100%',
      paddingHorizontal: 50,
      paddingVertical: 20
   },
});