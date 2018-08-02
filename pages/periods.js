import React, { PureComponent } from "react";
import { Collapse, Button, Row, Col } from "antd";
import { graphql } from "react-apollo";

import Layout from "../components/Layout";
import App from "../components/App";
import List from "../components/Procedures/List";
import FormModal from "../modules/periods/FormModal";

import PERIODS from "../graphql/queries/periods";

const Panel = Collapse.Panel;

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and
    faithfulness, it can be found as a welcome guest in many households across
    the world.
  </p>
);

class Periods extends PureComponent {
  state = {
    modalVisible: false
  };

  importOpenData = () => {
    console.log("importOpenData");
    var json = parser.toJson(xml);
  };

  render() {
    console.log("props", this.props);
    const {
      data: { legislativePeriods }
    } = this.props;

    return (
      <Layout>
        <App>
          <h2>Legislaturperioden</h2>
          <Collapse bordered={false}>
            {legislativePeriods.map(({ number, start, deputies, end }) => {
              const options = {
                // weekday: "long",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
              };
              const startFormatted = new Date(start).toLocaleDateString(
                "de-DE",
                options
              );
              const endFormatted = new Date(end).toLocaleDateString(
                "de-DE",
                options
              );
              return (
                <Panel
                  header={`${number} – ${deputies} – ${startFormatted}${
                    end ? ` – ${endFormatted}` : ""
                  }`}
                  key="number"
                >
                  {`${number}`}
                </Panel>
              );
            })}
          </Collapse>

          <Button
            style={{ margin: 10 }}
            type="primary"
            shape="circle"
            icon="plus"
            onClick={() => this.setState({ modalVisible: true })}
          />
          <FormModal
            visible={this.state.modalVisible}
            onClose={() => this.setState({ modalVisible: false })}
            onSave={values => {
              console.log("values", values);
              this.setState({ modalVisible: false });
            }}
          />
          <Button type="primary" onClick={this.importOpenData}>
            Import openData
          </Button>
        </App>
      </Layout>
    );
  }
}

export default graphql(PERIODS, {})(Periods);
