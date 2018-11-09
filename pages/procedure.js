import Layout from "../components/Layout";
import App from "../components/App";
import { withRouter } from "next/router";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import Link from "next/link";
import { Form, Input, Button, Popconfirm, notification } from "antd";

import VoteResultsForm from "../components/Procedures/VoteResultsForm";

// GraphQL
import PROCEDURE from "../graphql/queries/procedure";
import SET_EXPECTED_VOTE_DATE from "../graphql/mutations/setExpectedVotingDate";

// Ant Design Sub-Elements
const { TextArea } = Input;
const FormItem = Form.Item;

const DT = styled.dt`
  font-weight: bold;
`;

const DD = styled.dt`
  padding-left: 15px;
`;


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
    customData,
    namedVote,
    setExpectedVotingDate
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

  const confirmPossibleVoteDate = () => {
    setExpectedVotingDate(customData.possibleVotingDate).then((res) => {
      notification.success({
        key: "saveExpectedVoteDate",
        message: "Vorgang wurde gespeichert!"
      });
    })
    .catch(err => {
      notification.error({
        key: "saveExpectedVoteDate",
        message: "Ein Fehler ist vorgefallen",
      });
      console.log("Error:", err)
    });
  }

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
                  <a target="_blank">{`${document.type} (${document.editor} – ${
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
                      <a target="_blank">
                        {initiator} – {findSpot}
                      </a>
                    </Link>
                  </DD>
                );
              })}
            </>
          )}
          {customData.possibleVotingDate && !customData.expectedVotingDate && (
            <>
              <DT>Mögliches Abstimmungsdatum</DT>
                  <DD>
                    {customData.possibleVotingDate}
                    {customData.possibleVotingDate !== customData.expectedVotingDate && (
                     <Popconfirm title="Bist du dir da wirklich ganz sicher? 👀" onConfirm={confirmPossibleVoteDate} okText="Total! 😎" cancelText="Nö 🤔">
                      &nbsp;– <Button size="small" type="danger">Übernehmen</Button>
                    </Popconfirm>
                    )}
                  </DD>
            </>
          )}
        </dl>
        {!namedVote &&
        <VoteResultsForm
          data={customData.voteResults}
          type={type}
          procedureId={procedureId}
        />
      }
      </App>
    </Layout>
  );
};

export default withRouter(
  compose(
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
  }),
  graphql(SET_EXPECTED_VOTE_DATE, {
    props: ({ mutate, ownProps }) => {
      return {
        setExpectedVotingDate: async date => {
          const { procedureId } = ownProps;
          return mutate({
            variables: {
              expectedVotingDate: date,
              procedureId
            }
          });
        }
      };
    }
  })
  )(Procedure)
);
