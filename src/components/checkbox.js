import React, {
  Component
} from 'react';
import {
  Input,
  Label
} from 'reactstrap';
import classnames from 'classnames';

export default class Checkbox extends Component {
  constructor( props ) {
    super( props );
    this.ID = Math.random();
  }
  render() {
    return (
      <div className={"row checkbox-container " + this.props.className} style={this.props.style}>
        <Input
          type="checkbox"
          className="checkbox-input"
          checked={ this.props.value }
          disabled={ this.props.disabled }
          onChange={ this.props.onChange }
          id={ "checkbox-" + this.ID }
          />
        {
          !this.props.right &&
          <Label
            className={classnames(
              {
                'checkbox-mark-grey': this.props.disabled,
                'center-hor': this.props.centerHor,
                'center-ver': this.props.centerVer,
                'checkbox-mark': !this.props.highlighted,
                'checkbox-highlighted': this.props.highlighted
              }
            )}
            htmlFor={ "checkbox-" + this.ID }
            />
        }
        {
          this.props.label &&
          <Label
            htmlFor={ "checkbox-" + this.ID }
            className={classnames(
              {
                'm-l-5': !this.props.right, 
                'm-r-5': this.props.right,
                'center-hor': this.props.centerHor,
                'center-ver': this.props.centerVer
              },
              "clickable",
              "m-l-5",
              "noselect"
            )}
            >
            { this.props.label ? this.props.label : '' }
          </Label>
        }
        {
          this.props.right &&
          <Label
            className={classnames(
              {
                'checkbox-mark-grey': this.props.disabled,
                'center-hor': this.props.centerHor,
                'center-ver': this.props.centerVer,
                'checkbox-mark': !this.props.highlighted,
                'checkbox-highlighted': this.props.highlighted
              }
            )}
            htmlFor={ "checkbox-" + this.ID }
            />
        }
      </div>
    );
  }
}