/*/ TODO 

# POW Algorithm : 
1. Take current block’s block header, add mempool transactions
2. Append a nonce, starting at nonce = 0
3. Hash data from #1 and #2
4. Check hash versus target difficulty (provided by protocol)
5. If hash < target, puzzle is solved! Get rewarded.
6. Else, restart process from step #2, but increment nonce

Mempool  
Blocks 
MAX_TRABSACTION per block = 10

Functionalities
1. Add a transaction into mempool
2. Mine the transaction -> create a block
3. Calcualuting Blockhash -> transaction and nonce -> SHA256
*/

// R & D on POW
// POW how

// Can you build the POW blockchain

const SHA256 = require("crypto-js/sha256");
const TARGET_DIFFICULTY =
  BigInt(0x009ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];
let genesis = false;

function addTransaction(transaction) {
  //* Adding user transactions into mempool
  mempool.push(transaction);
  return mempool;
}

//* Mine a block
function mine() {
  let transactions = [...mempool];

  let newTransaction = [];
  for (let i = 0; i < transactions.length; i++) {
    //* Max 10 transaction per block
    if (i < MAX_TRANSACTIONS) {
      newTransaction.push(transactions[i]);
      mempool.pop(i);
    }
  }

  let nonce = 0;
  let hash = calculateHash(transactions, nonce);

  //* Iterating to find Blockchain Hash
  while (BigInt(`0x${hash}`) >= TARGET_DIFFICULTY) {
    nonce++;
    hash = calculateHash(transactions, nonce);
  }

  let prevBlockHash;
  let blockNumber;

  if (genesis == false) {
    prevBlockHash = "0x" + String(0).padStart(64, "0");

    blockNumber = 1;
    genesis = true;
  } else {
    prevBlockHash = blocks[blocks.length - 1].header.blockHash;
    blockNumber = blocks.length + 1;
  }

  const header = {
    height: blockNumber,
    prevBlockHash: prevBlockHash.toString(),
    timeStamp: Date.now(),
    blockHash: `0x${hash.toString()}`,
    nonce: nonce,
    difficulty: TARGET_DIFFICULTY,
  };

  blocks.push({
    header: header,
    transactions: newTransaction,
  });

  console.log(blocks);
  return blocks;
}

function calculateHash(transactions, nonce) {
  const data = transactions.join("") + nonce.toString();
  const hash = SHA256(data);
  return hash;
}

module.exports = {
  MAX_TRANSACTIONS,
  addTransaction,
  mine,
  blocks,
  mempool,
};
