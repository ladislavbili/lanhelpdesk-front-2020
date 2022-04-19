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
    addresses,
    passwords,
  } = props;
  const {
    t
  } = useTranslation();

  const noTitle = title.length < 1;
  const noCategory = !category || !category.id
  const noCompany = !company || !company.id;
  const problematicAddresses = addresses.filter( ( address ) => address.nic.length === 0 );
  const addressWithoutNic = problematicAddresses.length > 0;
  const problematicPasswords = passwords.filter( ( password ) => password.title.length === 0 );
  const passwordsWithoutTitle = problematicPasswords.length > 0;

  if ( ( !noTitle && !noCategory && !noCompany && !addressWithoutNic && !passwordsWithoutTitle ) || !show ) {
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
      { addressWithoutNic &&
        <div className="error-message m-t-5">
          {`${t('addressesMissingNic')}:`}
          { problematicAddresses.map((address) => (
            <div>
              `${t('addressesWithNic')} ${address.nic} ${t('andIp')} ${address.ip}.`
            </div>
          ))}
        </div>
      }
      { passwordsWithoutTitle &&
        <div className="error-message m-t-5">
          {`${t('cmdbItemPasswordMissingTitle')}:`}
          { problematicPasswords.map((password) => (
            <div>
              `${t('cmdbItemPasswordWithoutTitle')} ${password.id} ${t('andUsername')} ${password.username}.`
            </div>
          ))}
        </div>
      }
    </div>
  );
}