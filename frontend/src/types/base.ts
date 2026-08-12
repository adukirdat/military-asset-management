export type Base = { id: string; name: string; location: string; createdAt: string; updatedAt: string };
export type CreateBaseInput = Pick<Base, 'name' | 'location'>;
export type UpdateBaseInput = CreateBaseInput;
