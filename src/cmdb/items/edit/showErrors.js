import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function AddPageErrors( props ) {
  const {
    title,
    category,
    company,
    show,
  } = props;
  const {
    t
  } = useTranslation();

  const noTitle = title.length < 1;
  const noCategory = !category || !category.id
  const noCompany = !company || !company.id;

  if ( ( !noTitle && !noCategory && !noCompany ) || !show ) {
    return null;
  }

  return (
    <div className="full-width m-b-20">
      { noTitle &&
        <div className="error-message m-t-5">
          {`${t('title')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
      { noCategory &&
        <div className="error-message m-t-5">
          {`${t('category')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
      { noCompany &&
        <div className="error-message m-t-5">
          {`${t('company')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
    </div>
  );
}