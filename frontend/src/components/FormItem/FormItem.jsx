import React from "react";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { Checkbox, Input, Typography } from "antd";
const { TextArea } = Input;
const { Text } = Typography;
import styles from "../../styles/routes/authForm.module.scss";

export const FormItemInput = (props) => {
  FormItemInput.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    register: PropTypes.any,
    validation: PropTypes.any,
    control: PropTypes.any,
    errors: PropTypes.any,
  };
  return (
    <div className={styles.formItem}>
      <label htmlFor={props.name} className={styles.formLabel}>
        {props.label}
      </label>
      <Controller
        control={props.control}
        name={props.name}
        {...props.register(props.name, props.validation)}
        render={({ field }) => {
          return (
            <Input
              className={styles.formInput}
              {...field}
              placeholder={props.placeholder}
            />
          );
        }}
      />
      <Text type="danger" className={styles.formError}>
        {props.errors}
      </Text>
    </div>
  );
};

export const FormItemTextArea = (props) => {
  FormItemTextArea.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    register: PropTypes.any,
    validation: PropTypes.any,
    control: PropTypes.any,
    errors: PropTypes.any,
  };
  return (
    <div className={styles.formItem}>
      <label htmlFor={props.name} className={styles.formLabel}>
        {props.label}
      </label>
      <Controller
        control={props.control}
        name={props.name}
        {...props.register(props.name, props.validation)}
        render={({ field }) => {
          return (
            <TextArea
              className={styles.formInput}
              {...field}
              placeholder={props.placeholder}
            />
          );
        }}
      />
      <Text type="danger" className={styles.formError}>
        {props.errors}
      </Text>
    </div>
  );
};

export const FormItemCheckbox = (props) => {
  FormItemCheckbox.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    register: PropTypes.any,
    validation: PropTypes.any,
    control: PropTypes.any,
    errors: PropTypes.any,
  };
  return (
    <div className={styles.formItem}>
      <Controller
        control={props.control}
        name={props.name}
        {...props.register(props.name, props.validation)}
        render={({ field }) => {
          return <Checkbox {...field}>{props.label}</Checkbox>;
        }}
      />
      <Text type="danger" className={styles.formError}>
        {props.errors}
      </Text>
    </div>
  );
};
