import React from "react";

import PropTypes from "prop-types";

import { useSortable } from "@dnd-kit/sortable";
import EditRow from "./EditRow";

const SortableEditRow = (props) => {
  SortableEditRow.propTypes = {
    row: PropTypes.string,
    onChange: PropTypes.func,
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.row.id,
  });
  const style = transform && {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: "10",
    backgroundColor: "green",
  };

  return (
    <EditRow
      ref={setNodeRef}
      style={style}
      label={props.row.label}
      listeners={listeners}
      attributes={attributes}
      onChange={props.onChange}
    />
  );
};

export default SortableEditRow;
