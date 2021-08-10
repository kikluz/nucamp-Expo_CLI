import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite'
    }

   

    handleReservation() {
        console.log(JSON.stringify(this.state));
        
        const massage = `Number of Campers: ${this.state.campers}
                        \nHkie-In: ${this.state.hikeIn}
                        \nDate: ${this.state.date.toDateString('en-US')}`;
        Alert.alert(
            'Begin Search?',
            massage,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('not delete'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        // call async fucntion  here when ok button alert is pressed will present the notification 
                        this.presentLocalNotification(this.state.date.toLocaleDateString('en-US'));
                        this.resetForm();
                    }
                }
            ],
            {cancelable: false}
        )
    
    
    }
        resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
            showModal: false     
        });
    }
// request permission from this device then wait for those permision to send back to our app
// before we can continue async fucntion returns a promise
    async presentLocalNotification(date) {
        // this fucntion to call when ready
        function sendNotification() {
            //  overwrite to show alert
            Notifications.setNotificationHandler({
                // show an alert 
                handleNotification: async () => ({
                    shouldShowAlert: true
                })
            });
            // provider for the Notifications API 
            Notifications.scheduleNotificationAsync({
                // pass conten Object hold the title  
                content: {
                    title: 'Your Campsite Reservation Search',
                    // literal syntax for date requested 
                    body: `Search for ${date} requested`
                },
                // trigger to null will cause the Notifications to fire right away 
                // also can be use to schedule the notifiction in the future 
                trigger: null
            });
        }
        // check if we have permition from the device to send notification at all 
        // await keyword is a js ES8 can only be use inside an async fucntion 
        // whe this promise are fullfill will asign to the permissions variable
        let permissions = await Notifications.getPermissionsAsync();
        // check for permissions are not granted
        if (!permissions.granted) {
            // wait for the result of the promise return from requestPermissionsAsync()
            permissions = await Notifications.requestPermissionsAsync();
        }
        // if permission is truthy
        if (permissions.granted) {
            sendNotification();
        }
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation='zoomIn' duration={2000} delay={1000}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Campers</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.campers}
                        onValueChange={itemValue => this.setState({campers: itemValue})}
                    >
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Hike-In?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.hikeIn}
                        trackColor={{true: '#5637DD', false: null}}
                        onValueChange={value => this.setState({hikeIn: value})}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date</Text>
                    <Button
                        onPress={() =>
                            this.setState({showCalendar: !this.state.showCalendar})
                        }
                        title={this.state.date.toLocaleDateString('en-US')}
                        color='#5637DD'
                        accessibilityLabel='Tap me to select a reservation date'
                    />
                </View>
                {this.state.showCalendar && (
                    <DateTimePicker
                        value={this.state.date}
                        mode={'date'}
                        display='default'
                        onChange={(event, selectedDate) => {
                            selectedDate && this.setState({date: selectedDate, showCalendar: false});
                        }}
                        style={styles.formItem}
                    />
                )}
                <View style={styles.formRow}>
                    <Button
                        onPress={()=> this.handleReservation()}
                        title='Search'
                        color='#5637DD'
                        accessibilityLabel='Tap me to search for available campsites to reserve'
                    />
                </View>
                </Animatable.View>
                
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
   
});

export default Reservation;
