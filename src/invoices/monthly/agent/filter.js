import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  actions
} from 'configs/constants/statuses';
import {
  pickSelectStyle
} from 'configs/components/select';

import {
  Label
} from 'reactstrap';
import Select from 'react-select';
import Switch from "components/switch";

import MonthSelector from 'invoices/components/monthSelector';

import {
  useTranslation
} from "react-i18next";

import {
  setReportsFromDate,
  setReportsToDate,
  setReportsStatusActions,
} from 'apollo/localSchema/actions';

import {
  translateAllSelectItems,
} from 'helperFunctions';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
  GET_REPORTS_STATUS_ACTIONS
} from 'apollo/localSchema/queries';

export default function AgentFilter( props ) {
  const {
    statusActions,
    setStatusActions,
    onTrigger,
    invoiced,
    setInvoiced,
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );
  const {
    data: statusActionsData,
  } = useQuery( GET_REPORTS_STATUS_ACTIONS );

  return (
    <div className="max-width-850 m-t-10 m-b-20">
      <MonthSelector
        blockedShow={statusActionsData.reportsStatusActions.length === 0}
        fromDate={fromDateData.reportsFromDate}
        onChangeFromDate={(date) => {
          setReportsFromDate( date );
        }}
        toDate={toDateData.reportsToDate}
        onChangeToDate={(date) => {
          setReportsToDate( date );
        }}
        onTrigger={onTrigger}
        />
      <div>
        <Label>{t('statusAction')}:</Label>
        <Select
          isMulti
          placeholder={t('statusActionLabel')}
          value={translateAllSelectItems(statusActionsData.reportsStatusActions, t)}
          options={translateAllSelectItems(actions, t)}
          onChange={(statusActions) => {
            setReportsStatusActions( statusActions );
          }}
          styles={pickSelectStyle()}
          />
      </div>
      <Switch
        value={invoiced}
        onChange={() => {
          setInvoiced(!invoiced);
        }}
        label={t('invoiced')}
        simpleSwitch
        />
    </div>
  );
}