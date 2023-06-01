/**
 * Func to decrypt a data
 * @param {string} encryptedValue
 * @returns {string}
 */
function getDecryptedData (encryptedValue) {
  const buff = Buffer.from(encryptedValue, 'base64')
  const decryptedValue = buff.toString('ascii')
  return decryptedValue
}

module.exports = { getDecryptedData }
