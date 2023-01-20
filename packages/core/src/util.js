import _ from "lodash/fp.js"

export const joinPaths = (...segments) =>
  _.filter((x) => x !== "" && !_.isNil(x), segments).join(".")
