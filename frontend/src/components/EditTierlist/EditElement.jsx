import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/routes/editTierlistPage.module.scss";

// eslint-disable-next-line react/display-name
const EditElement = forwardRef(({ rawImage, style, ...props }, ref) => {
  EditElement.propTypes = {
    rawImage: PropTypes.string,
    style: PropTypes.any,
  };
  const inlineStyles = {
    backgroundImage: `url("${rawImage}")`,
    ...style,
  };

  return (
    <div
      ref={ref}
      style={inlineStyles}
      {...props}
      className={styles.tierElement}
    />
  );
});

export default EditElement;
