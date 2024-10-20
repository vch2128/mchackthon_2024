import React, { useState, useContext } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import type { FormProps } from 'antd';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
const { RangePicker } = DatePicker;

interface CampaignUpdate {
  name?: string;
  description?: string;
  price?: number;
  image_path?: string;
  quantity?: number;
  lasting_hours?: number;
  attenders_id?: string[];
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


const HostEventForm: React.FC = ({ closeModal }) => {
const { user } = useContext(UserContext);
  const [componentVariant, setComponentVariant] = useState<FormProps['variant']>('filled');
  const [messageApi, contextHolder] = message.useMessage();
  const onFormVariantChange = ({ variant }: { variant: FormProps['variant'] }) => {
    setComponentVariant(variant);
  };
  const success = () => {
    closeModal();
    messageApi.open({
      type: 'success',
      content: 'Host the event successfully',
    });
  };

  const error_ = (text: string) => {
    closeModal();
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  const hostAnEvent = async (campaign: CampaignUpdate) => {
    try {
      const response = await axios.post('/api/campaign', campaign, {
        headers: { 'Content-Type': 'application/json' },
      });
      success()
      console.log('Campaign created successfully:', response.data);
      return response.data; // Return the created campaign data
    } catch (error) {
      error_("Error creating campaign")
      console.error('Error creating campaign:', error);
      throw error; // Re-throw error to be caught by the caller
    }
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    console.log(values.InputHours)
    const campaign: CampaignUpdate = {
      name: values.InputEventName,
      price: 0,
      description: values.TextAreaDescription,
      lasting_hours: values.InputHours,
      quantity: values.SelectQuantity,
      attenders_id: [user.id],
      image_path: "/images/campaign.jpg"
    };

    try {
      await hostAnEvent(campaign);
    } catch (error) {
      error_("Submission failed")
      console.error('Submission failed:', error);
    }
  };
  
  return (
    <>
      {contextHolder} 
      <Form
      {...formItemLayout}
      onValuesChange={onFormVariantChange}
      onFinish={onFinish}
      variant={componentVariant}
      style={{ maxWidth: 600, margin: 'auto' }} // Center form
      initialValues={{ variant: componentVariant }}
    >
      <Form.Item
        label="Event Name"
        name="InputEventName"
        rules={[{ required: true, message: 'Please input the event name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="TextAreaDescription"
        rules={[{ required: true, message: 'Please input the description!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Lasting Hours"
        name="InputHours"
        rules={[{ required: true, message: 'Please input the lasting hours!' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Attenders"
        name="SelectQuantity"
        rules={[{ required: true, message: 'Please select the quantity!' }]}
      >
        <Select>
          <Select.Option value={3}>3</Select.Option>
          <Select.Option value={4}>4</Select.Option>
          <Select.Option value={5}>5</Select.Option>
          <Select.Option value={6}>6</Select.Option>
          <Select.Option value={7}>7</Select.Option>
          <Select.Option value={8}>8</Select.Option>
          <Select.Option value={9}>9</Select.Option>
          <Select.Option value={10}>10</Select.Option>
          <Select.Option value={15}>15</Select.Option>
          <Select.Option value={20}>20</Select.Option>
          <Select.Option value={30}>30</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 3 }, // Adjust offset to align button with form inputs
      }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </>
  );
};

export default HostEventForm;
