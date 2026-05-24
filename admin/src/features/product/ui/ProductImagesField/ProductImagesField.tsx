import { DeleteOutlined, StarFilled, StarOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, Tag, Upload, message } from "antd";
import type { UploadProps } from "antd";

import { MEDIA_FOLDER_PRODUCTS, useUploadImages } from "@src/entities/media";
import { getErrorMessage } from "@src/shared/lib";

import type { ProductImagesFieldProps } from "./ProductImagesField.props";
import { PRODUCT_IMAGES_MAX } from "./ProductImagesField.props";

import styles from "./ProductImagesField.module.css";

export const ProductImagesField = ({
  value,
  onChange,
  maxImages = PRODUCT_IMAGES_MAX,
}: ProductImagesFieldProps) => {
  const { mutateAsync, isPending } = useUploadImages();

  const handleUpload: UploadProps["customRequest"] = async ({ file, onSuccess, onError }) => {
    const files = [file as File];

    if (value.gallery.length + files.length > maxImages) {
      message.error(`Максимум ${maxImages} изображений`);
      onError?.(new Error("Limit exceeded"));
      return;
    }

    try {
      const response = await mutateAsync({ files, folder: MEDIA_FOLDER_PRODUCTS });
      const newGallery = [...value.gallery, ...response.urls];
      const mainImage = value.mainImage || response.urls[0] || "";

      onChange({ mainImage, gallery: newGallery });
      onSuccess?.(response);
    } catch (error) {
      message.error(getErrorMessage(error));
      onError?.(error as Error);
    }
  };

  const handleSetMain = (url: string) => {
    onChange({ ...value, mainImage: url });
  };

  const handleRemove = (url: string) => {
    const gallery = value.gallery.filter((item) => item !== url);
    const mainImage = value.mainImage === url ? gallery[0] ?? "" : value.mainImage;

    onChange({ mainImage, gallery });
  };

  return (
    <div className={styles.field}>
      <Upload
        accept="image/*"
        customRequest={handleUpload}
        disabled={isPending || value.gallery.length >= maxImages}
        multiple
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} loading={isPending}>
          Загрузить изображения
        </Button>
      </Upload>

      <p className={styles.hint}>
        Загружено {value.gallery.length} из {maxImages}. Нажмите на звезду, чтобы выбрать главное
        фото.
      </p>

      {value.gallery.length > 0 && (
        <div className={styles.grid}>
          {value.gallery.map((url) => {
            const isMain = value.mainImage === url;

            return (
              <div className={styles.item} key={url}>
                <Image alt="" className={styles.preview} src={url} />
                {isMain && (
                  <Tag className={styles.mainTag} color="gold">
                    Главное
                  </Tag>
                )}
                <div className={styles.actions}>
                  <Button
                    icon={isMain ? <StarFilled /> : <StarOutlined />}
                    size="small"
                    type={isMain ? "primary" : "default"}
                    onClick={() => handleSetMain(url)}
                  />
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleRemove(url)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
