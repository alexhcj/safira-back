import { Schema as MongooseSchema } from 'mongoose';

export function getSubdocumentPath(
  parentSchema: MongooseSchema,
  path: string,
): MongooseSchema.Types.Subdocument {
  return parentSchema.path(path) as unknown as MongooseSchema.Types.Subdocument;
}
