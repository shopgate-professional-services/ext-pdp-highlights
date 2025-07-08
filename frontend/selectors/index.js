import { createSelector } from 'reselect';
import {
  getProductId,
  getProducts,
  makeGetProductPropertiesUnfiltered,
} from '@shopgate/engage/product/selectors/product';
import { highlights, maxDisplayCount } from '../config';

/**
 * @typedef {Object} Property
 * @param {string} label Property label
 * @param {string} value Property value
 */

/**
 * @typedef {Object} PropertiesAndTags
 * @property {Property[]} properties Product properties
 * @property {string[]} tags Product tags
 */

/**
 * @callback GetPropertiesAndTagsSelector
 * @param {any} state The Redux state object
 * @param {Object} [props] The component props
 * @returns {PropertiesAndTags}
 */

/**
 * Creates a selector that collects the product properties and tags
 * @returns {GetPropertiesAndTagsSelector}
 */
export const makeGetProductPropertiesAndTags = () => {
  const getProductProperties = makeGetProductPropertiesUnfiltered();

  return createSelector(
    getProductProperties,
    getProductId,
    getProducts,
    (productProperties, productId, products) => {
      const product = products?.[productId]?.productData;
      let properties = [];
      let tags = [];

      if (Array.isArray(product?.properties)) {
        // Collect properties from the product object if available
        ({ properties } = product);
      } else if (Array.isArray(productProperties)) {
        // Collect properties from the product properties state
        properties = productProperties;
      }

      if (Array.isArray(product?.additionalProperties)) {
        // Collect additional properties injected by @shopgate/products-add-properties
        const propertyCodes = properties.map(property => property.code);
        product.additionalProperties.forEach((property) => {
          if (!propertyCodes.includes(property.code)) {
            properties.push(property);
          }
        });
      }

      if (Array.isArray(product?.tags)) {
        ({ tags = [] } = product);
      }

      return {
        properties,
        tags,
      };
    }
  );
};

/**
 * @typedef {Object} HighlightContent
 * @property {string} icon Icon SVG string
 * @property {string} text Text to display
 */

/**
 * @typedef {Object} Highlight
 * @property {HighlightContent} content The content to display
 * @property {Object} style The style to apply to the content
 */

/**
 * @callback GetHighlightsSelector
 * @param {any} state The Redux state object
 * @param {Object} [props] The component props
 * @returns {Highlight[]}
 */

/**
 * Creates a selector that retrieves product highlights based on product properties and tags.
 * @returns {GetHighlightsSelector}
 */
export const makeGetHighlights = () => {
  const getProductPropertiesAndTags = makeGetProductPropertiesAndTags();

  return createSelector(
    getProductPropertiesAndTags,
    (propertiesAndTags) => {
      const result = [];

      for (let i = 0; i < highlights.length; i += 1) {
        const {
          type, property, tag, content, style = {},
        } = highlights[i];

        let match;

        if (type === 'property' && property) {
          match = propertiesAndTags.properties.find(
            entry => entry.label === property?.label && entry.value === property.value
          );
        } else if (type === 'tag' && tag) {
          match = propertiesAndTags.tags.find(
            entry => entry?.trim() === tag?.trim()
          );
        } else if (type === 'static') {
          match = true;
        }

        if (match && content) {
          result.push({
            content,
            style,
          });
        }

        if (result.length >= maxDisplayCount) {
          break;
        }
      }

      return result;
    }
  );
};
