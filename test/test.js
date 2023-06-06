const { assert } = require("chai");
const { mine, blocks, mempool, addTransaction } = require("../pow");

describe("POW Consensus", () => {
  describe("Adding 15 transaction into mempool", () => {
    before(() => {
      for (let i = 0; i < 15; i++) {
        addTransaction({ sender: "bob", to: "alice", amount: 500 });
      }
    });
    describe("Mining Genesis Block", () => {
      before(() => {
        mine();
      });
      it("should have 1 blocks", () => {
        assert.equal(blocks.length, 1);
      });

      it("should have prevBlockHash", () => {
        assert.equal(
          blocks[blocks.length - 1].header.prevBlockHash,
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        );
      });
      it("should have 10 transactions in the block", () => {
        assert.equal(blocks[blocks.length - 1].transactions.length, 10);
      });
      it("should reduce the mempool to 5", () => {
        assert.equal(mempool.length, 5);
      });
      it("should have a nonce", () => {
        assert.isDefined(
          blocks[blocks.length - 1].header.nonce,
          "did not find a nonce on the block"
        );
      });
      it("should have a blockhash lower than the target difficulty", () => {
        let actual = blocks[blocks.length - 1].header.blockHash.toString();
        actual = actual.slice(2);

        const isLess =
          BigInt(`0x${actual}`) < blocks[blocks.length - 1].header.difficulty;
        assert(
          isLess,
          "expected the blockhash to be less than the target difficulty"
        );
      });
      describe("Mining again", () => {
        before(() => {
          mine();
        });
        it("should have 2 blocks", () => {
          assert.equal(blocks.length, 2);
        });
        it("should store 5 transactions on the block", () => {
          assert.equal(blocks[blocks.length - 1].transactions.length, 5);
        });
        it("should clear the mempool to 0", () => {
          assert.equal(mempool.length, 0);
        });
        it("should have a nonce", () => {
          assert.isDefined(
            blocks[blocks.length - 1].header.nonce,
            "did not find a nonce on the block"
          );
        });
        it("should have a blockhash lower than the target difficulty", () => {
          let actual = blocks[blocks.length - 1].header.blockHash.toString();
          actual = actual.slice(2);
          const isLess =
            BigInt(`0x${actual}`) < blocks[blocks.length - 1].header.difficulty;
          assert(
            isLess,
            "expected the blockhash to be less than the target difficulty"
          );
        });
      });
    });
  });
});
