import { UserPrivateSchema, UserPublicSchema } from "../../schemas/users";

export const USER_PUBLIC_KEYS = Object.keys(UserPublicSchema.shape);

export const USER_PRIVATE_KEYS = Object.keys(UserPrivateSchema.shape);

export const USER_PUBLIC_PROJECTION = USER_PUBLIC_KEYS.join(", ");

export const USER_PRIVATE_PROJECTION = USER_PRIVATE_KEYS.join(", ");
