const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, lastHash, hash, data, lottery_id, lottery_players, lottery_minimum_players) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.lottery_id = lottery_id;
    this.lottery_players = lottery_players;
    this.lottery_minimum_players = 3;
  }

  toString() {
    return `Block - 
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Data      : ${this.data}
      Lottery ID: ${this.lottery_id}
      Lottery Players: ${this.lottery_players}
      Lottery Minimum Players: ${this.lottery_minimum_players}`;
  }

  static genesis() {
    return new this('Genesis time', '----', 'genesis-hash', [], 0, [], null);
  }

  static hash(timestamp, lastHash, data, lottery_id, lottery_players, lottery_minimum_players) {
    return SHA256(`${timestamp}${lastHash}${data}${lottery_id}${lottery_players}${lottery_minimum_players}`).toString();
  }

  // Register players while the lottery is open or resets the lottery and adds the winner to the data field of the new block
  static mineBlock(lastBlock, data, resetLottery = false) {
    let hash;
    let timestamp = Date.now();
    const lastHash = lastBlock.hash;
    let lottery_id;
    let lottery_players;
    let lottery_minimum_players;

    if (resetLottery) {
      lottery_id = lastBlock.lottery_id + 1;
      lottery_players = [];
      lottery_minimum_players = lastBlock.lottery_minimum_players;
      data = `Winner of lottery ${lottery_id} is: ${data}.`
    } else {
      lottery_id = lastBlock.lottery_id;
      lottery_players = lastBlock.lottery_players;
      lottery_minimum_players = lastBlock.lottery_minimum_players;
      lottery_players.push(`Player: ${data}`); // Add new player to lottery array
    }

    hash = Block.hash(timestamp, lastHash, data, lottery_id, lottery_players, lottery_minimum_players);
    return new this(timestamp, lastHash, hash, data, lottery_id, lottery_players,lottery_minimum_players);
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, lottery_id, lottery_players, lottery_minimum_players } = block;
    return Block.hash(timestamp, lastHash, data, lottery_id, lottery_players, lottery_minimum_players);
  }
}

module.exports = Block;