import React from "react";

import PropTypes from "prop-types";

import { useSortable } from "@dnd-kit/sortable";
import EditElement from "./EditElement";

const SortableEditElement = ({ element }) => {
  SortableEditElement.propTypes = {
    element: PropTypes.object,
    index: PropTypes.number,
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: element.id,
  });
  const style = transform && {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
    zIndex: "10",
  };
  return (
    <EditElement
      ref={setNodeRef}
      rawImage={element.rawImage}
      style={style}
      {...listeners}
      {...attributes}
    />
  );
};

export default SortableEditElement;
