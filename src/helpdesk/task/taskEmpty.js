import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function TaskEmpty( props ) {

  const {
    t
  } = useTranslation();

  return (
    <div className="flex">
			<div className="basic-border-top commandbar">
				<div className="d-flex flex-row align-items-center">
				</div>
			</div>
			<div className="card-box row fit-with-header-and-commandbar">
				<div className=" center-ver center-hor">
				  {t('selectTaskFromTheLeft')}
				</div>
			</div>
		</div>
  );
}