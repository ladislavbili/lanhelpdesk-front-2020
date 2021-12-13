import React from 'react';
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  useTranslation
} from "react-i18next";

export default function TaskTypeEdit( props ) {
  const {
    t
  } = useTranslation();

  const [ replacement, setReplacement ] = React.useState( null );
  return (
    <Modal isOpen={props.isOpen}>
      <ModalHeader>
        {`${t('deleteReplacementInfo1')} ${props.label} ${t('deleteReplacementInfo2')}`}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Select
            styles={pickSelectStyle()}
            options={props.options}
            value={replacement}
            onChange={replacement => setReplacement(replacement)}
            />
        </FormGroup>

      </ModalBody>
      <ModalFooter>
        <Button className="btn-link mr-auto"onClick={props.close}>
          {t('cancel')}
        </Button>
        <Button className="btn ml-auto" disabled={!replacement} onClick={() => props.finishDelete(replacement)}>
          {t('completeDeletion')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}