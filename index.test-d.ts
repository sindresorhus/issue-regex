import {expectType} from 'tsd';
import issueRegex = require('.');

expectType<RegExp>(issueRegex());
