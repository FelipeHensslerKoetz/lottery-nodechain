const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    if (this.lotteryIsOpenForRegistrations()) {
      const block = Block.mineBlock(this.chain[this.chain.length - 1], data, false);
      this.chain.push(block);
      console.log(`New block added: ${block.toString()}`);
    }

    if (!this.lotteryIsOpenForRegistrations()) {
      console.log("Lottery is closed for registrations");
      console.log("Picking a winner...");
      const winner = this.pickWinner(); 
      console.log("Winner is: " + winner); 

      // Reset lottery and add winner into data field of new block
      const newLotteryBlock = Block.mineBlock(this.chain[this.chain.length - 1], winner, true);
      this.chain.push(newLotteryBlock);
      console.log(`New block added: ${newLotteryBlock.toString()}`);
    }
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if ((block.lastHash !== lastBlock.hash) || (
        block.hash !== Block.blockHash(block)))
        return false;
    }

    return true;

  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Recieved chain is not longer than the current chain");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("Recieved chain is invalid");
      return;
    }

    console.log("Replacing the current chain with new chain");
    this.chain = newChain;
  }

  lotteryIsOpenForRegistrations() {
    return this.chain[this.chain.length - 1].lottery_players.length < this.chain[this.chain.length - 1].lottery_minimum_players;
  }

  pickWinner() {
    if (!this.lotteryIsOpenForRegistrations()) {
      const lottery_players = this.chain[this.chain.length - 1].lottery_players;
      const winner = lottery_players[Math.floor(Math.random() * lottery_players.length)];
      return winner;
    }
  }
}

module.exports = Blockchain;