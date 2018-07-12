import gql from "graphql-tag";

import VoteResults from "../fragments/voteResults";

export default gql`
  mutation saveProcedureCustomData(
    $procedureId: String!
    $partyVotes: [PartyVoteInput!]!
    $decisionText: String!
    $votingDocument: String!
  ) {
    saveProcedureCustomData(
      procedureId: $procedureId
      partyVotes: $partyVotes
      decisionText: $decisionText
      votingDocument: $votingDocument
    ) {
      ...VoteResults
    }
  }
  ${VoteResults}
`;
