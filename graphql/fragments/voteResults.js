import gql from "graphql-tag";

export default gql`
  fragment VoteResults on Procedure {
    customData {
      voteResults {
        yes
        no
        abstination
        decisionText
        votingDocument
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
`;
