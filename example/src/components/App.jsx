/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Slider,
  Button,
} from 'antd';
import React from 'react';
import { hot } from 'react-hot-loader';

import styles from './App.scss';


const FormItem = Form.Item;
const { Option } = Select;


const App = () => (
  <Form horizontal className={styles.form}>
    <FormItem
      label="Frequency"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
    >
      <InputNumber size="large" min={1} max={10} style={{ width: 100 }} defaultValue={3} name="inputNumber" />
      <span className="ant-form-text">minutes (<a href="#">change units</a>)</span>
    </FormItem>

    <FormItem
      label="Enable"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
    >
      <Switch defaultChecked name="switch" />
    </FormItem>

    <FormItem
      label="Resource Usage"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
    >
      <Slider style={{ width: 232 }} defaultValue={70} />
    </FormItem>

    <FormItem
      label="Docker Image"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
    >
      <Select size="large" defaultValue="centos7" style={{ width: 192 }} name="select">
        <Option value="arch">Arch Linux</Option>
        <Option value="centos7">CentOS 7</Option>
        <Option value="ubuntu" disabled>Ubuntu</Option>
      </Select>
    </FormItem>

    <FormItem
      style={{ marginTop: 120 }}
      wrapperCol={{ span: 8, offset: 8 }}
    >
      <Button size="large" type="primary" htmlType="submit">
        Save
      </Button>
      <Button size="large" style={{ marginLeft: 8 }}>
        Reset
      </Button>
    </FormItem>
  </Form>
);


export default hot(module)(App);
