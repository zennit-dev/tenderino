export type DynamicSegmentProps<T extends string = "id"> = {
  params: Promise<Record<T, string>>;
};
