import gql from "graphql-tag";

const proceduresQuery = gql`
  query procedures($voteDate: [Boolean!], $limit: Int, $offset: Int) {
    procedures(voteDate: $voteDate, limit: $limit, offset: $offset) {
      procedureId
      title
      type
      period
      currentStatus
      importantDocuments {
        type
        editor
        number
        url
      }
      history {
        assignment
        initiator
        findSpot
        findSpotUrl
        decision {
          type
        }
      }
      customData {
        voteResults {
          yes
          no
          abstination
          decisionText
          partyVotes {
            party
            main
            deviants {
              yes
              abstination
              no
            }
          }
        }
      }
    }
  }
`;

export default proceduresQuery;
