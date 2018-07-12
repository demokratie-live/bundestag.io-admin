import Layout from "../components/Layout";
import App from "../components/App";
import { withRouter } from "next/router";
import { graphql } from "react-apollo";
import styled from "styled-components";
import Link from "next/link";
import { Form, Input, Button } from "antd";

import VoteResultsForm from "../components/Procedures/VoteResultsForm";

// Ant Design Sub-Elements
const { TextArea } = Input;
const FormItem = Form.Item;

const DT = styled.dt`
  font-weight: bold;
`;

const DD = styled.dt`
  padding-left: 15px;
`;

import PROCEDURE from "../graphql/queries/procedure";

const Procedure = props => {
  const {
    loadingProcedure,
    procedureId,
    title,
    currentStatus,
    type,
    period,
    importantDocuments,
    history,
    customData
  } = props;

  if (loadingProcedure) {
    return (
      <Layout>
        <App>
          <div>loading</div>
        </App>
      </Layout>
    );
  }

  const plenaryProtocolls = history.filter(
    ({ assignment, initiator, findSpot, ...rest }) => {
      return findSpot.indexOf("BT-Plenarprotokoll") !== -1;
    }
  );

  return (
    <Layout>
      <App>
        <h2>{title}</h2>
        <dl
          style={{
            display: "block",
            marginTop: "1em",
            marginBottom: "1em",
            marginLeft: 0,
            marginRight: 0
          }}
        >
          <DT>Prozedur ID</DT>
          <DD>{procedureId}</DD>
          <DT>Status</DT>
          <DD>{currentStatus}</DD>
          <DT>Typ</DT>
          <DD>{type}</DD>
          <DT>Legislaturperiode</DT>
          <DD>{period}</DD>
          <DT>Dokumente</DT>
          {importantDocuments.map(document => {
            return (
              <DD key={document.number}>
                <Link href={document.url}>
                  <a>{`${document.type} (${document.editor} – ${
                    document.number
                  })`}</a>
                </Link>
              </DD>
            );
          })}
          {plenaryProtocolls.length > 0 && (
            <>
              <DT>Plenarprotokoll</DT>
              {plenaryProtocolls.map(({ initiator, findSpotUrl, findSpot }) => {
                return (
                  <DD key={findSpot}>
                    <Link href={findSpotUrl}>
                      <a>
                        {initiator} – {findSpot}
                      </a>
                    </Link>
                  </DD>
                );
              })}
            </>
          )}
        </dl>
        <VoteResultsForm
          data={customData.voteResults}
          type={type}
          procedureId={procedureId}
        />
      </App>
    </Layout>
  );
};

export default withRouter(
  graphql(PROCEDURE, {
    options: ({ router: { query } }) => {
      return {
        variables: {
          procedureId: query.id
        },
        fetchPolicy: "cache-and-network"
      };
    },
    props: ({ data: { loading, procedure, ...data } }) => {
      if (loading) {
        return {
          loadingProcedure: loading
        };
      }
      return {
        loadingProcedure: loading,
        ...procedure
      };
    }
  })(Procedure)
);
