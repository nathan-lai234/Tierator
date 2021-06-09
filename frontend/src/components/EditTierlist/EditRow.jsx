import React, { forwardRef } from "react";

import PropTypes from "prop-types";
import styles from "../../styles/routes/editTierlistPage.module.scss";

import { Input } from "antd";
import { Controller } from "react-hook-form";

// eslint-disable-next-line react/display-name
const EditRow = forwardRef((props, ref) => {
  EditRow.propTypes = {
    style: PropTypes.any,
    label: PropTypes.string,
    listeners: PropTypes.any,
    attributes: PropTypes.any,
    onChange: PropTypes.func,
  };

  return (
    <div ref={ref} style={props.style} className={styles.tierRow}>
      <Input
        placeholder="Row label"
        className={styles.rowLabel}
        onChange={props.onChange}
        value={props.label}
      />
      <div
        {...props.listeners}
        {...props.attributes}
        className={styles.rowHandle}
      ></div>
    </div>
  );
});

export default EditRow;
