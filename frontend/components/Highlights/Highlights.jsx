import React, { useMemo } from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useCurrentProduct } from '@shopgate/engage/core/hooks';
import { Icon } from '@shopgate/engage/components';
import { makeGetHighlights } from '../../selectors';
import { containerStyle, highlightStyle } from '../../config';

const styles = {
  container: css({
    margin: 16,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
    ...containerStyle,
  }),
  highlight: css({
    display: 'flex',
    flex: '1 1 calc((100% - 32px) / 3)',
    flexDirection: 'column',
    gap: 4,
    textAlign: 'center',
    alignItems: 'center',
    ...highlightStyle,
  }),
};

/**
 * @returns {JSX.Element|null} The Highlights component.
 */
const Highlights = () => {
  const { productId, variantId } = useCurrentProduct();
  const getHighlights = useMemo(() => makeGetHighlights(), []);

  const highlights = useSelector(state => getHighlights(state, {
    productId,
    variantId,
  }));

  if (highlights.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.container, 'pdp-highlights__container')}>
      {highlights.map((highlight, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={classNames(
            styles.highlight,
            'pdp-highlights__highlight',
            highlight?.style && typeof highlight.style === 'object' && css(highlight.style)
          )}
        >
          { highlight.content.icon && (
            <Icon content={highlight.content.icon} size={28} />
          )}
          {highlight.content.text && (
            <span>{highlight.content.text}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Highlights;
