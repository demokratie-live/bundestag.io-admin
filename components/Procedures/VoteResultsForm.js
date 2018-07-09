import React, { Component } from "react";
import { Form, Input, Button, Radio } from "antd";

// Ant Design Sub-Elements
const { TextArea } = Input;
const FormItem = Form.Item;

class VoteResultsForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("decisionText", {
            rules: [{ required: true, message: "Beschlusstext fehlt!" }]
          })(<TextArea placeholder="Beschlusstext" rows="3" />)}
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Speichern
          </Button>
        </FormItem>
        <FormItem className="collection-create-form_last-form-item">
          {getFieldDecorator("modifier", {
            initialValue: "public"
          })(
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(VoteResultsForm);
