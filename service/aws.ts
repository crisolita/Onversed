import AWS from "aws-sdk";
import { Readable } from "stream";
import fs from "fs";
const spacesEndpoint = new AWS.Endpoint(
  process.env.SPACEENDPOINT ? process.env.SPACEENDPOINT : ""
);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACEKEYID,
  secretAccessKey: process.env.SPACESECRETKEY,
});
// Subir una imagen
export const uploadImage = async (key: ArrayBuffer, ruta: string) => {
  const stream = new Readable();
  stream.push(Buffer.from(key));
  stream.push(null);
  const params = {
    Bucket: "onversedspace",
    Key: `${ruta}.jpg`,
    Body: stream,
    ACL: "private",
  };
  s3.upload(params, function (err: any, data: any) {
    if (err) {
      console.error("Error al subir la imagen:", err);
    } else {
      console.log("Imagen subida:", data.Location);
    }
  });
};
// Obtener una imagen
export const getImage = async (key: string) => {
  const getObjectParams = {
    Bucket: "onversedspace",
    Key: `${key}.jpg`,
  };
  const imageUrl = s3.getSignedUrl("getObject", getObjectParams);
  return imageUrl;
};
/// borrar una imagen
export const deleteImageAWS = async (key: string) => {
  const params = {
    Bucket: "xperiend-images",
    Key: `${key}.jpg`,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log("Imagen eliminada con éxito");
  } catch (err) {
    console.error("Error al eliminar la imagen:", err);
  }
};

export const getMedia = async (key: string) => {
  const getObjectParams = {
    Bucket: "onversedspace",
    Key: key,
  };
  const imageUrl = s3.getSignedUrl("getObject", getObjectParams);
  return imageUrl;
};
export const uploadMedia = async (key: ArrayBuffer, ruta: string) => {
  const stream = new Readable();
  stream.push(Buffer.from(key));
  stream.push(null);
  const params = {
    Bucket: "onversedspace",
    Key: `${ruta}`,
    Body: stream,
    ACL: "private",
  };
  s3.upload(params, function (err: any, data: any) {
    if (err) {
      console.error("Error al subir la media:", err);
    } else {
      console.log("Media subida:", data.Location);
    }
  });
};
