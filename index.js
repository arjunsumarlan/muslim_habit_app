/** @format */

import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Intro from './src/screen/Intro';
import { FormattedProvider } from 'react-native-globalize';
import SQLite from 'react-native-sqlite-storage'

const render = () => (
    <FormattedProvider>
      <Intro/>
    </FormattedProvider>
)

AppRegistry.registerComponent(appName, () => render);
