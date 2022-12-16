import React from 'react';
import {
   TouchableOpacity,
   StyleSheet,
   Text,
   TouchableOpacityProps
} from 'react-native';

import fonts from '../styles/fonts';
import colors from '../styles/colors';

interface ButtonProps extends TouchableOpacityProps {
   title: string;
}

export default function Button({ title, ...rest }: ButtonProps) {
   return (
      <TouchableOpacity style={styles.container} {...rest}>
         <Text style={styles.text}>
            {title}
         </Text>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: colors.green,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center'
   },
   text: {
      fontSize: 16,
      color: colors.white,
      fontFamily: fonts.heading
   }
});
