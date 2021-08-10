import {expectType} from 'tsd';
import issueRegex from './index.js';

expectType<RegExp>(issueRegex());
