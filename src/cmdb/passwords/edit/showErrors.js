import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function EditManualErrors( props ) {
  const {
    show,
    title,
    login,
    password,
    passwordCheck,
  } = props;
  const {
    t
  } = useTranslation();

  const noTitle = title.length < 1;
  const noLogin = login.length < 1;
  const noPassword = password.length < 1;
  const passwordCheckFailed = password !== passwordCheck;

  if ( ( !noTitle && !noLogin && !noPassword && !passwordCheckFailed ) || !show ) {
    return null;
  }

  return (
    <div className="full-width m-b-20">
      { noTitle &&
        <div className="error-message m-t-5">
          {`${t('cmdbPasswordMissingTitle')}!`}
        </div>
      }
      { passwordCheckFailed &&
        <div className="error-message m-t-5">
          {`${t('cmdbPasswordPasswordCheckFailed')}!`}
        </div>
      }
      { noPassword &&
        <div className="warning-message m-t-5">
          {`${t('cmdbPasswordMissingPassword')}!`}
        </div>
      }
      { noLogin &&
        <div className="warning-message m-t-5">
          {`${t('cmdbPasswordMissingLogin')}!`}
        </div>
        }
    </div>
  );
}