export function getRuleInBinary(ruleNumber) {
  let binaryDigits = `000000000${parseInt(ruleNumber, 10).toString(2)}`.substr(-8)
  return (binaryDigits).toString(10).split("").map(Number);
}

export function getRuleInString(ruleArray) {
  let ruleNumbers = ruleArray.join("")
  return parseInt(ruleNumbers, 2).toString(10)
}
