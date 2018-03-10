import { Button } from 'antd';
import React from 'react';
import { hot } from 'react-hot-loader';

import styles from './App.scss';


const ButtonGroup = Button.Group;

const App = () => (
  <div className={styles.container}>
    <h1 className={styles.header}>The Color of This Header Is <code>@blue-10</code></h1>
    <ButtonGroup>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="danger">Danger</Button>
    </ButtonGroup>
  </div>
);


export default hot(module)(App);
