import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import Loading from './components/LoadingComponent';


// Bring both persistor and store using Object destructuring Syntax
const {persistor, store} = ConfigureStore();

export default function App() {
    return (
        <Provider store={store}>
            {/* wrapp main in the PersistGate prevent the redux store to render until has
            rehydrated fully from the client-site store 
             */}
            <PersistGate loading={<Loading />}  persistor={persistor}>
                <Main />
            </PersistGate>
        </Provider>
    );
}



// console.disableYellowBox = true;

