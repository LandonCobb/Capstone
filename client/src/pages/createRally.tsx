import * as React from "react"
import Template from "@/components/template"
import { Form, Input, Select, Checkbox, Button } from "antd";
import { v4 as uuidv4 } from 'uuid';
import * as T from "@/types";
import {createRally} from "../services/rally"
import { useForm } from "antd/lib/form/Form";

const { Option } = Select;

const CreateRally:  React.FC = () => {
    //const [form] = Form.useForm();
    const onFinish = async (rally: any) => {
        // Handle form submission here
        const t_rally: T.Rally = {
            ralliId: uuidv4(),
            name: rally.rallyName,
            vehicleType: rally.vehicleType,
            isPrivate: rally.isPrivate,
            regFee: rally.registrationFee,
            startPoint: rally.startPoint,
            endPoint: rally.endPoint
        };

        const res = await createRally(t_rally);

        if (res) console.log("it worked");
        else console.log("it failed");
        console.log("Form values:", t_rally);
        //form.resetFields();

      };

    return <Template>
        <div style={{ textAlign: 'center' }}>
            <h1>Host your own Rally</h1>
            <Form
          name="createRallyForm"
          onFinish={onFinish}
          style={{ maxWidth: "400px", margin: "0 auto" }}
        >
          <Form.Item
            label="Rally name"
            name="rallyName"
            rules={[{ required: true, message: "Please enter the rally name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vehicle type"
            name="vehicleType"
            rules={[{ required: true, message: "Please select a vehicle type!" }]}
          >
            <Select>
              <Option value="car">Car</Option>
              <Option value="motorbike">Motorbike</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Start point"
            name="startPoint"
            rules={[{ required: true, message: "Please enter the start point!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="End point"
            name="endPoint"
            rules={[{ required: true, message: "Please enter the end point!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Registration fee"
            name="registrationFee"
            rules={[
              { required: true, message: "Please enter the registration fee!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="isPrivate" valuePropName="checked">
            <Checkbox>Private</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create!
            </Button>
          </Form.Item>
        </Form>
        </div>
    </Template>
}

export default CreateRally