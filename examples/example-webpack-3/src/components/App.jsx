import { Button } from 'antd';
import React from 'react';
import { hot } from 'react-hot-loader';


const ButtonGroup = Button.Group;

const App = () => (
  <ButtonGroup style={{ padding: 10 }}>
    <Button type="primary">Primary</Button>
    <Button>Default</Button>
    <Button type="dashed">Dashed</Button>
    <Button type="danger">Danger</Button>
  </ButtonGroup>
);


export default hot(module)(App);
