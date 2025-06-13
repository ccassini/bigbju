export const CONTRACT_ADDRESS = "0x2f057a0e5d2d539161085f9aa665a46380869c39";

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "player", "type": "string" },
      { "internalType": "uint256", "name": "score", "type": "uint256" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTopPlayers",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "player", "type": "string" },
          { "internalType": "uint256", "name": "score", "type": "uint256" }
        ],
        "internalType": "struct Leaderboard.Player[5]",
        "name": "",
        "type": "tuple[5]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
