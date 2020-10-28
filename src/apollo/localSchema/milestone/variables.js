import {
  makeVar
} from "@apollo/client";

import {
  noMilestone
} from 'configs/constants/sidebar';

export const milestoneVar = makeVar( noMilestone );