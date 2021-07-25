async function shouldThrow(promise) {
  try {
    await promise;
    assert(true);
  } catch (err) {
    return;
  }
  assert(false, "The contract did not throw.");
}

// function keccak(text) {
//   web3.sha3(web3.utils.padRight(web3.utils.asciiToHex(text), 66), {
//     encoding: "hex",
//   });
// }

module.exports = {
  shouldThrow,
  // keccak,
};
