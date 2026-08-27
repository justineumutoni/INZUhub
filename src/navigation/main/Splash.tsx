import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to INZUhub</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C56C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color:'#FDFDFD'
  }
});

export { Splash };