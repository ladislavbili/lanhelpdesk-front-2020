import React from 'react';
import moment from 'moment';

import {
  pickSelectStyle
} from 'configs/components/select';
import {
  months
} from 'configs/constants/reports';
import {
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import Select from 'react-select';

import DatePicker from 'components/DatePicker';
import {
  useTranslation
} from "react-i18next";

var years = [];
for ( let i = moment()
    .year(); i >= 2000; i-- ) {
  years.push( {
    value: i,
    label: i
  } );
}

export default function MonthSelector( props ) {
  const {
    blockedShow,
    showFreeDateSelect,
    fromDate,
    onChangeFromDate,
    toDate,
    onChangeToDate,
    onTrigger,
  } = props;

  const {
    t
  } = useTranslation();

  const [ year, setYear ] = React.useState( {
    label: moment()
      .year(),
    value: moment()
      .year()
  } );
  const [ month, setMonth ] = React.useState( translateSelectItem(
    months[ moment()
      .month() ], t
  ) );

  return (
    <div>
        <FormGroup>
          <Label>{t('selectMonthAndYear')}</Label>
          <div className="flex-row">
            <div className="width-50-p p-r-20">
              <Select
                value={month}
                onChange={setMonth}
                options={translateAllSelectItems(months,t)}
                styles={pickSelectStyle()}
                />
            </div>
            <div className="width-50-p p-r-20">
              <Select
                value={year}
                onChange={setYear}
                options={years}
                styles={pickSelectStyle()}
                />
            </div>
            <Button
              type="button"
              disabled={
                year===null ||
                month===null ||
                blockedShow
              }
              className="btn-primary max-width-150"
              onClick={() => {
                let firstDay = moment({ year: year.value, month: month.value-1}).startOf('month');
                let lastDay = moment({ year: year.value, month: month.value-1}).endOf('month');
                onChangeFromDate(firstDay);
                onChangeToDate(lastDay);
                onTrigger(firstDay, lastDay);
              }}
              >
              {t('show')}
            </Button>
          </div>
        </FormGroup>
        { showFreeDateSelect &&
          <FormGroup>
            <Label>{t('selectPrefferedDateRange')}</Label>
            <div className="flex-row">
              <div className="flex flex-input p-r-20">
                <DatePicker
                  hideTime
                  placeholderText={t('from')}
                  className="form-control"
                  selected={fromDate}
                  onChange={date => onChangeFromDate(date) }
                  />
              </div>
              <div className="flex flex-input p-r-20">
                <DatePicker
                  hideTime
                  placeholderText={t('to')}
                  className="form-control"
                  selected={toDate}
                  onChange={date => onChangeToDate(date)}
                  />
              </div>
              <Button
                type="button"
                className="btn-primary max-width-150"
                disabled={
                  blockedShow ||
                  ( fromDate !== null &&
                    toDate !== null &&
                    ( fromDate.valueOf() > toDate.valueOf() )
                  )
                }
                onClick={() => onTrigger(fromDate, toDate)}
                >
                {t('show')}
              </Button>
            </div>
          </FormGroup>
        }
      </div>
  );
}