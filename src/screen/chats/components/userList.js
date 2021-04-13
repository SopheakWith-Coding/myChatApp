import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

export default class Card extends React.Component {
  render() {
    const {onPress, item, image} = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.SubContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50}}
              source={{uri: image}}
            />
          </View>

          <View style={styles.TextWrapper}>
            <Text style={styles.TextTitle}>{item.name}</Text>
            <Text style={styles.TextSubTitle}>
              {item.latestMessage.text.slice(0, 90)}
            </Text>
          </View>
          <View style={styles.TimeWrapper}>
            <Text>
              {moment(item.latestMessage.createdAt).format('hh:mm A')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SubContainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  TextWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    width: screenWidth / 2 + 35,
  },
  TimeWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    marginRight: 15,
    width: screenWidth / 8 + 20,
  },
  TextTitle: {
    fontSize: 18,
  },
  TextSubTitle: {
    fontSize: 14,
  },
});
