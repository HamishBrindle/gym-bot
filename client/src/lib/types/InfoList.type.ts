/**
 * `InfoListItem` is used to render lists of details in one or more
 * groups. It's not a recursive structure, but it does handle one
 * layer of nesting, via the optional `siblings` field.
 */
export type InfoListItem = {
  label: string;
  value: string | string[] | number;
  icon: string;
  divider: boolean;
  siblings?: Array<Omit<InfoListItem, 'siblings'|'icon'|'divider'>>;
};

/**
 * `InfoList` is a collection of `InfoListItem` and will group them
 * together for organized display.
 */
export type InfoList = Array<InfoListItem>;

/**
 * `InfoListSection` is an object containing a label and
 * an `InfoList`, and is used to render separated lists of
 * information.
 */
export type InfoListSection = {
  label: string;
  items: InfoList;
};
