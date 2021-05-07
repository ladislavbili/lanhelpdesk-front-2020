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

export default function TaskTypeEdit( props ) {
  const [ replacement, setReplacement ] = React.useState( null );
  return (
    <Modal isOpen={props.isOpen}>
      <ModalHeader>
        {`Please choose ${props.label} to replace the deleted one`}
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
          Cancel
        </Button>
        <Button className="btn ml-auto" disabled={!replacement} onClick={() => props.finishDelete(replacement)}>
          Complete deletion
        </Button>
      </ModalFooter>
    </Modal>
  )
}