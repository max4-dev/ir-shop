import { useMutation } from "@tanstack/react-query";

import { mediaQuery } from "../../api";

export const useUploadImages = () =>
  useMutation({
    mutationFn: ({ files, folder }: { files: File[]; folder: string }) =>
      mediaQuery.uploadImages(files, folder),
  });
