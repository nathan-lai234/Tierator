import React, { useEffect, useState } from "react";

import API from "../../api/api";
import styles from "../../styles/routes/editTierlistPage.module.scss";
import { whitespaceRule } from "../../helpers/inputValidation";

import {
  FormItemInput,
  FormItemTextArea,
  FormItemCheckbox,
} from "../../components/FormItem/FormItem";
import SortableEditElement from "../../components/EditTierlist/SortableEditElement";

import { PageHeader, Button, Input } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { useParams } from "react-router";
import { get, useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EditElement from "../../components/EditTierlist/EditElement";
import SortableEditRow from "../../components/EditTierlist/SortableEditRow";

export function EditTierlistPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const api = new API();
  const { id } = useParams();

  const [isOwner, setIsOwner] = useState(false);
  const [tierlist, setTierlist] = useState({});
  const [activeId, setActiveId] = useState(null);

  const [rows, setRows] = useState([
    { label: "", id: "0" },
    { label: "", id: "1" },
    { label: "", id: "2" },
  ]);

  const maxDescriptionLength = 500;
  // Drag and drop hook
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const { isOver, setNodeRef } = useDroppable({
    id: "elementsList",
  });
  const listStyle = {
    backgroundColor: isOver && "green",
  };
  // List of file upload by the user, the order of the list determine the order of the elements in the tier list
  const [filelist, setFilelist] = useState([]);

  // The current filelistId used to differentiate files for sortable drag and drop list
  let filelistId = getNextId(filelist);
  let rowsId = getNextId(rows);

  //  Get the next id for an tier element, each id has to be unique as each id identifies a tier element drag and drop property
  // This may face issues (integer overflow) when a users adds a FUCKTON of elements.... but that wont happen right? Maybe put a fail safe if it does so
  function getNextId(array) {
    if (array.length <= 0) {
      return 0;
    }
    let largest = 0;
    for (const thing of array) {
      if (parseInt(thing.id) > largest) {
        largest = thing.id;
      }
    }
    largest++;
    return largest;
  }

  // Get tier list data and preset all values in their respective prompt
  // Determine if the user is also the owner of the tierlist
  useEffect(async () => {
    const res = await api.readTierlist(id);
    setIsOwner(res.isOwner);
    setTierlist(res.tierlist);
    setValue("title", res.tierlist.title);
  }, []);

  const onSubmit = () => {
    console.log("Asd");
  };

  // Covert given file into base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Get the index of the file with the given id, used in handleDragEnd for element reordering
  const indexOfFileId = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        return i;
      }
    }
    return -1;
  };

  const handleDragElementStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragElementCancel = (event) => {
    //Removes active focus
    document.activeElement.blur();
    setActiveId(null);
  };

  // When a element is moved to a different id, move the element
  const handleDragElementEnd = (event) => {
    const { active, over } = event;
    if (active === null || over === null) return;
    if (active.id !== over.id) {
      setFilelist((filelist) => {
        const oldIndex = indexOfFileId(filelist, active.id);
        const newIndex = indexOfFileId(filelist, over.id);
        return arrayMove(filelist, oldIndex, newIndex);
      });
    }
    //Removes active focus

    document.activeElement.blur();
    setActiveId(null);
  };

  const handleDragRowEnd = (event) => {
    const { active, over } = event;
    if (active === null || over === null) return;
    if (active.id !== over.id) {
      setRows((rows) => {
        const oldIndex = indexOfFileId(rows, active.id);
        const newIndex = indexOfFileId(rows, over.id);
        return arrayMove(rows, oldIndex, newIndex);
      });
    }
    //Removes active focus

    document.activeElement.blur();
    // setActiveId(null);
  };

  const getImage = (id) => {
    for (const file of filelist) {
      if (file.id === id) {
        return file.rawImage;
      }
    }
    return null;
  };

  // The on drop function when uploading new files.
  // Add a rawImage and id property, for display and sorting respectively
  const onDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      file.rawImage = await getBase64(file);
      file.id = filelistId.toString();
      filelistId++;
    }
    setFilelist([...filelist, ...acceptedFiles]);
  };

  const setRowLabel = (event, id) => {
    const value = event.target.value;
    let newRows = [...rows];
    for (const row of newRows) {
      if (row.id === id) {
        row.label = value;
        break;
      }
    }
    setRows(newRows);
  };

  const addNewRow = () => {
    setRows([...rows, { label: "", id: rowsId.toString() }]);
    rowsId++;
  };

  return (
    <form
      name="editTierlist"
      className={styles.tierForm}
      onSubmit={handleSubmit(onSubmit)}
    >
      <PageHeader title={tierlist.title} />
      <FormItemInput
        name="title"
        label="Title"
        placeholder="Enter title"
        register={register}
        validation={{
          required: true,
          validate: {
            whitespace: (v) => whitespaceRule(v),
          },
        }}
        control={control}
        errors={
          <>
            {errors.title?.type === "required" && "Username is required"}
            {errors.title?.type === "whitespace" &&
              "Username must not be only spaces"}
          </>
        }
      />
      <FormItemTextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        register={register}
        validation={{ maxLength: maxDescriptionLength }}
        control={control}
        errors={
          <>
            {errors.description?.type === "maxLength" &&
              `Max number of characters is ${maxDescriptionLength}`}
          </>
        }
      />
      <FormItemCheckbox
        name="public"
        label="Public"
        register={register}
        control={control}
      />
      <FormItemCheckbox
        name="spoiler"
        label="Spoiler"
        register={register}
        control={control}
      />

      {/* Rows */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragRowEnd}
      >
        <SortableContext items={rows} strategy={verticalListSortingStrategy}>
          {rows.map((row, index) => {
            return (
              <SortableEditRow
                key={index}
                row={row}
                onChange={(event) => {
                  setRowLabel(event, row.id);
                }}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      <div className={styles.addRow} onClick={addNewRow}>
        <PlusOutlined /> Add Row
      </div>

      {/* Upload Images */}
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} className={styles.imageDropzone}>
              <input {...getInputProps()} />
              <UploadOutlined className={styles.uploadIcon} />
              <p>Drag and Drop items here! Or click to select files.</p>
            </div>
          </section>
        )}
      </Dropzone>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragElementStart}
        onDragCancel={handleDragElementCancel}
        onDragEnd={handleDragElementEnd}
      >
        <SortableContext
          items={filelist}
          strategy={rectSortingStrategy}
          className={styles.tierElementList}
        >
          <div
            ref={setNodeRef}
            style={listStyle}
            className={styles.tierElementList}
          >
            {filelist.map((file, index) => {
              return <SortableEditElement key={index} element={file} />;
            })}
          </div>
        </SortableContext>
        <DragOverlay adjustScale={true} zIndex={50}>
          {activeId ? <EditElement rawImage={getImage(activeId)} /> : null}
        </DragOverlay>

        <div className={styles.deleteElement}>
          <DeleteOutlined className={styles.deleteIcon} />
          <p>Drag and Drop items here to remove them from the tierlist</p>
        </div>
      </DndContext>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
}

export default EditTierlistPage;
