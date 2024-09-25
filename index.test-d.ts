import {expectType} from 'tsd';
import issueRegex from './index.js';

expectType<RegExp>(issueRegex());
expectType<RegExp>(issueRegex({}));
expectType<RegExp>(issueRegex({additionalPrefix: 'GH-'}));
