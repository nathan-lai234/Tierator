import React, { useEffect, useState } from "react";

import styles from "../../styles/routes/editTierlistPage.module.scss";

import { whitespaceRule } from "../../helpers/inputValidation";

import { useParams } from "react-router";
import API from "../../api/api";
import {
  FormItemInput,
  FormItemTextArea,
  FormItemCheckbox,
} from "../../components/FormItem/FormItem";

import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";

import { PageHeader, Button } from "antd";

import Dropzone from "react-dropzone";
// const { Text } = Typography;

import { useForm } from "react-hook-form";

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
  const [filelist, setFilelist] = useState([]);

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
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const maxDescriptionLength = 500;
  console.log({ isOwner });
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

      <Dropzone
        onDrop={async (acceptedFiles) => {
          console.log(acceptedFiles);
          for (const file of acceptedFiles) {
            file.rawImage = await getBase64(file);
          }
          setFilelist([...filelist, ...acceptedFiles]);
        }}
      >
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
      <div className={styles.tierElementList}>
        {filelist.map((file, index) => {
          return (
            <div key={index}>
              <img
                alt={file.name}
                src={file.rawImage}
                className={styles.tierElement}
              ></img>
            </div>
          );
        })}
      </div>

      <div className={styles.deleteElement}>
        <DeleteOutlined className={styles.deleteIcon} />
        <p>Drag and Drop items here to remove them from the tierlist</p>
      </div>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
}

export default EditTierlistPage;
