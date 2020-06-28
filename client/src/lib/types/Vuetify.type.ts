/**
 * TODO: Work in progress
 *
 * The idea is to get all the Vuetify components in here as types
 * so we know what kind of props to feed in through the form
 * schemas
 *
 * I don't think this has to be exhaustive, but it may be worth
 * generating these using the Vuetify API doc generator in their
 * repo:
 *
 * https://github.com/vuetifyjs/vuetify/tree/master/packages/api-generator
 *
 */

/**
 * Text Field type with props
 */
export type VTextField = {
  appendIcon: string;
  appendOuterIcon: string;
  autofocus: boolean;
  backgroundColor: string;
  clearIcon: string;
  clearable: boolean;
  color: string;
  counter: boolean | number | string;
  counterValue: Function | null;
  /**
   * Defaults to `false`
   */
  dark: boolean;
  /**
   * Defaults to `false`
   */
  dense: boolean;
  /**
   * Defaults to `false`
   */
  disabled: boolean;
  /**
   * Defaults to `false`
   */
  error: boolean;
  /**
   * Defaults to `1`
   */
  errorCount: number | string;
  /**
   * Defaults to `[]`
   */
  errorMessages: Array<string>;
  /**
   * Defaults to `false`
   */
  filled: boolean;
  // flat: {
  //   "name": "flat",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // fullWidth: {
  //   "name": "fullWidth",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // height: {
  //   "name": "height",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "number",
  //       "string"
  //     ]
  //   }
  // },
  // hideDetails: {
  //   "name": "hideDetails",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "boolean",
  //       "string"
  //     ]
  //   }
  // },
  // hint: {
  //   "name": "hint",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // id: {
  //   "name": "id",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // label: {
  //   "name": "label",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // light: {
  //   "name": "light",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // loaderHeight: {
  //   "name": "loaderHeight",
  //   "default": "2",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "number",
  //       "string"
  //     ]
  //   }
  // },
  // loading: {
  //   "name": "loading",
  //   "default": "false",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "boolean",
  //       "string"
  //     ]
  //   }
  // },
  // messages: {
  //   "name": "messages",
  //   "default": "[]",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "string",
  //       "array"
  //     ]
  //   }
  // },
  // outlined: {
  //   "name": "outlined",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // persistentHint: {
  //   "name": "persistentHint",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // placeholder: {
  //   "name": "placeholder",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // prefix: {
  //   "name": "prefix",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // prependIcon: {
  //   "name": "prependIcon",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // prependInnerIcon: {
  //   "name": "prependInnerIcon",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // readonly: {
  //   "name": "readonly",
  //   "type": "boolean",
  //   "default": "false",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // reverse: {
  //   "name": "reverse",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // rounded: {
  //   "name": "rounded",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // rules: {
  //   "name": "rules",
  //   "default": "[]",
  //   "value": {
  //     "kind": "expression",
  //     "type": "array"
  //   }
  // },
  // shaped: {
  //   "name": "shaped",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // singleLine: {
  //   "name": "singleLine",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // solo: {
  //   "name": "solo",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // soloInverted: {
  //   "name": "soloInverted",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // success: {
  //   "name": "success",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // successMessages: {
  //   "name": "successMessages",
  //   "default": "[]",
  //   "value": {
  //     "kind": "expression",
  //     "type": [
  //       "string",
  //       "array"
  //     ]
  //   }
  // },
  // suffix: {
  //   "name": "suffix",
  //   "default": "\"undefined\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // type: {
  //   "name": "type",
  //   "default": "\"'text'\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "string"
  //   }
  // },
  // validateOnBlur: {
  //   "name": "validateOnBlur",
  //   "type": "boolean",
  //   "default": "\"false\"",
  //   "value": {
  //     "kind": "expression",
  //     "type": "boolean"
  //   }
  // },
  // value: {
  //   "name": "value",
  //   "value": {
  //     "kind": "expression",
  //     "type": "any"
  //   }
  // }
}
