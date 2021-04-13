import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export default class ViewProfile extends React.Component {
  render() {
    const {users, image, onPress} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
              <Image
                style={{width: 120, height: 120, borderRadius: 60}}
                source={{uri: image}}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.textTitle}>{users.name}</Text>
          <Text style={styles.textSubtitle}>{users.phonenumber}</Text>
        </View>

        <View style={styles.informationContainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 25, height: 25}}
              source={{
                uri:
                  'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
              }}
            />
          </View>
          <View style={styles.textViewInformation}>
            <Text style={styles.textInformation}>{users.name}</Text>
          </View>
        </View>

        <View style={styles.informationContainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 22, height: 22}}
              source={{
                uri:
                  'https://www.clipartmax.com/png/middle/139-1399436_calendar-icons-facebook-date-of-birth-icon.png',
              }}
            />
          </View>
          <View style={styles.textViewInformation}>
            <Text style={styles.textInformation}>{users.dob}</Text>
          </View>
        </View>

        <View style={styles.informationContainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 22, height: 25}}
              source={{
                uri:
                  'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png',
              }}
            />
          </View>
          <View style={styles.textViewInformation}>
            <Text style={styles.textInformation}>{users.phonenumber}</Text>
          </View>
        </View>
        <View style={styles.viewButton}>
          <Button title="Log Out" onPress={onPress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    backgroundColor: '#ffd54f',
  },
  imageWrapper: {
    marginBottom: 15,
  },
  textTitle: {
    fontSize: 28,
  },
  textSubtitle: {
    fontSize: 18,
    color: 'lightgrey',
  },
  informationContainer: {
    backgroundColor: 'white',
    height: 50,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imageView: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textViewInformation: {
    flex: 1,
    justifyContent: 'center',
  },
  textInformation: {
    marginLeft: 20,
    fontSize: 20,
  },
  viewButton: {
    marginTop: 20,
  },
});
