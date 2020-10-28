import {
  makeVar
} from "@apollo/client";

import {
  allMilestones
} from 'configs/constants/sidebar';

export const milestoneVar = makeVar( allMilestones );