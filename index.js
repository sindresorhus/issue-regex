'use strict';

// https://regex101.com/r/SQrOlx/13
module.exports = () => /(?:(?<=[\s<[(])\w[\w-.]+\/\w[\w-.]+|\B)#[1-9]\d*\b/g;
