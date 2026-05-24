import { uploadClient } from "@src/shared/api";

import { mediaApi } from "./media.api";
import { MEDIA_FIELD_NAME } from "../model/constants/media.constants";
import type { UploadImagesResponse } from "./types/media.types";

export const mediaQuery = {
  uploadImages: (files: File[], folder: string) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(MEDIA_FIELD_NAME, file);
    });

    return uploadClient
      .post<UploadImagesResponse>(mediaApi.uploadImages, {
        searchParams: { folder },
        body: formData,
      })
      .json();
  },
};
