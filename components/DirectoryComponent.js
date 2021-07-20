import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Directory(props) {

    const renderDirectoryItem = ({item}) => {
        return (
            <ListItem 
                title={item.name}
                subtitle={item.description}
                // Object takes a property of source source
                onPress={() => props.onPress(item.id)}
                leftAvatar={{ source: require('./images/react-lake.jpg')}}
            />
        );
    };

    return (
        <FlatList
            // get data from
            data={props.campsites}
            // render each item in the list 
            renderItem={renderDirectoryItem}
            // key extractor setup a unique key for each item 
            keyExtractor={item => item.id.toString()}
        />
    );
}

export default Directory;