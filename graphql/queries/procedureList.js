import gql from "graphql-tag";
import VoteResults from "../fragments/voteResults";

const proceduresQuery = gql`
  query procedures($voteDate: [Boolean!], $limit: Int, $offset: Int) {
    procedures(voteDate: $voteDate, limit: $limit, offset: $offset) {
      procedureId
      title
      type
      period
      currentStatus
      namedVote
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
      ...VoteResults
    }
  }
  ${VoteResults}
`;

export default proceduresQuery;
