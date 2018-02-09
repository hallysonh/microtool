/// <reference path="./string.d.ts" />

const CONSECUTIVE_SPACES = /^\x20+|\x20+$/gm;
const NEWLINES_MATCH = /[\r\n]+/g;

String.prototype.trimLine = function(this: string) {
  return this.replace(CONSECUTIVE_SPACES, "").replace(NEWLINES_MATCH, " ").trim();
};
