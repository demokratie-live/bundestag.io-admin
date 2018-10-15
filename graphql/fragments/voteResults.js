import gql from "graphql-tag";

export default gql`
  fragment VoteResults on Procedure {
    customData {
      possibleVotingDate
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
