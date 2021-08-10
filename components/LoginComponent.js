import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';



class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: false
        };
    }

    static nagigationOptions = {
        title: 'Login'
    }
    
    // handleLogin event hadler
    handleLogin(){
        // Log the state to the console
        console.log(JSON.stringify(this.state));
        // check if the remember me CheckBox is checked
        if(this.state.remember) {
            // if it is save the username nad password to SecureStore
            SecureStore.setItemAsync(
                // first argument this will be the key 
                'userinfo',
                // convert to json string before to store 
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
                // add a catch block and error will pass as an argument 
            ).catch(error => console.log('Could not safe user info', error));
        } else {
            // delete any data stored under the key userinfo
            SecureStore.deleteItemAsync('userinfo')
            .catch(error => console.log('Could not delete usere info', error)
            );
        }
    }

// ensure that the userinfo is retrieved from the secure store  whe conponent mounts
    componentDidMount(){
        // check if there is any data saved under the key userinfo
        SecureStore.getItemAsync('userinfo')
        // access the value with then() method
        .then(userdata => {
            // change as an javascript object  using the parse() method
            const userinfo = JSON.parse(userdata);
            // check if  non-null truthy value 
            if(userinfo) {
                // if so update the loging component state 
                this.setState({username: userinfo.username});
                this.setState({password: userinfo.password});
                this.setState({remember: true})
            }
        });
    }

    render() {
        return (

            <View style={styles.container}>
                <Input
                    placeholder='Username'
                    leftIcon={{type: 'font-awesome', name: 'user-o'}}
                    // whenever the text value for input is changed, will update the username in the state
                    // using the setState
                    onChangeText={username => this.setState({username})}
                    // set the value so reflects the state which it makes a conttrol component
                    value={this.state.username}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />

                <Input
                    placeholder='password'
                    leftIcon={{type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />

                <CheckBox title="Remember me" center
                    checked={this.state.remember}
                    // change the state of wherever it currenlty is if its false or true
                    onPress={()=> this.setState({remember: !this.state.remember})}
                    containerStyle={styles.formCheckBox}
                />

                <View style={styles.formButton} >
                    <Button 
                    // return the handleLogin() method 
                        onPress={() => this.handleLogin()}
                        title='Login'
                        color='#5637DD'
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formIcon: { marginRight: 10 },
    formInput: { padding: 10 },
    formCheckBox: {
        margin: 10,
        backgroundColor: null
    },
    formButton: {
        margin: 40
    }
});

export default Login;