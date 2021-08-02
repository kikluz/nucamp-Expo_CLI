import React, {Component } from 'react';
import { FlatList, View, Text  } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

// Taks Access campsites data from Redux state
// Use connect() function to connect to redux store 
// Use mapStateToProps function to pass campsites state to components as a props 

const mapStateToProps = state => {
    return {
        // getting data from the state 
        campsites: state.campsites,
        favorites: state.favorites
    };
};

// Setup Favorites Component
class Favorites extends Component {
    // add stack navigator  
    static navigationOptions = {
        title: 'My Favorites'
    }

    render() {
        // we need access to the navigate function, is availabel to the method of the navigation props  
        const { navigate } = this.props.navigation;
        // destructuring the current item from the array
        const renderFavoriteItem = ({item}) => {
            return (
                <ListItem 
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}}
                    // turn it into a link using th eonPress props 
                    onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}
                />
            );
        };

        // check if data is loading 
        if(this.props.campsites.isLoading){
            return <Loading />;
        }
        // if its not loading return error 
        if(this.props.campsites.errMess) {
            return (
                <View>
                    <Text>{this.props.campsites.errMess}</Text>
                </View>
            );
        }
        // if errrMess is false return FlatList conponent
        return (
            <FlatList
            //   filtered out campsite id, and matches with favorites id and access via props favorites
                data={this.props.campsites.campsites.filter(
                    campsite => this.props.favorites.includes(campsite.id)
                )} 
                // render renderItem prop 
                renderItem={renderFavoriteItem}
                // keyExtractor prop, passing eact item into a fucntion  and extracting the id from it as string
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}
// export by default to mapStateToProps as an arguement
export default connect(mapStateToProps)(Favorites)