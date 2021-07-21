import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import { CAMPSITES } from '../shared/campsites';
import { View } from 'react-native';
import CampsiteInfo from './CampsiteInfoComponent';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // setup state property to hold campsites data 
            campsites: CAMPSITES,
            // keep track of which campsite has been selected
            selectedCampsite: null
        };
    }

    // event handler that will update this selected campsite property in state whenever
    // our campsite our campsite is selected 
    onCampsiteSelect(campsiteId) {
        // setState to update the state  
        this.setState({selectedCampsite: campsiteId});
    }

    render() {
        // passing the entire campsite array, Directory component reveive as a property of the 
        // props object  
        return (
            // View will wrap around both components 
            <View style={{flex: 1}}>

                <Directory 
                    campsites={this.state.campsites} 
                    // onPress, arraow fucntio that takes campsiteId as a parameter and contain the
                    // onCampsiteSelect event hadler inside the fucntion body  
                    onPress={campsiteId => this.onCampsiteSelect(campsiteId)} 
                />

                <CampsiteInfo
                // passing the prop campsite, passing the entire campsite object 
                // and filter it and look for matching campsite id
                    campsite={this.state.campsites.filter(
                        campsite => campsite.id === this.state.selectedCampsite)[0]}
                />
            </View> 
        );
    }
}

export default Main;