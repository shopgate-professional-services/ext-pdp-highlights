import React from 'react';
import PropTypes from 'prop-types';
import HighlightsCmp from '../../components/Highlights';
import { portalPosition } from '../../config';

/**
 * Portal component that renders the Highlights component.
 * @param {Object} props The component props
 * @returns {JSX.Element|null}
 */
const Highlights = ({ name }) => {
  if (name !== portalPosition) {
    return null;
  }

  return (
    <HighlightsCmp />
  );
};

Highlights.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Highlights;
