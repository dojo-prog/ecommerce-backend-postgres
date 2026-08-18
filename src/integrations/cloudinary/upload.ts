import cloudinary from "./client";

interface UploadImageResult {
  url: string;
  public_id: string;
}

// =======================================
// HELPER
// =======================================

const folder = (dirPath: string) =>
  `portfolio-projects/e-comm-backend/${dirPath}`;

// =======================================
// MULTER FILE UPLOADER
// =======================================

const uploadMulterImage = async (
  file: Express.Multer.File,
  dirPath: string,
): Promise<UploadImageResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder(dirPath),
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(
            new Error("Cloudinary upload failed", { cause: error }),
          );
        }

        if (!result) {
          return reject(new Error("Cloudinary returned no result"));
        }

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(file.buffer);
  });
};

// =======================================
// LOCAL FILE UPLOADER
// =======================================

const uploadLocalImage = async (
  file: string,
  dirPath: string,
): Promise<UploadImageResult> => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder: folder(dirPath),
      resource_type: "image",
    });

    return {
      url: res.secure_url,
      public_id: res.public_id,
    };
  } catch (error) {
    throw new Error("Cloudinary upload failed", { cause: error });
  }
};

export { uploadMulterImage, uploadLocalImage };
