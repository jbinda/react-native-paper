/* @flow */

import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Text from '../Typography/Text';

import { LABEL_PADDING_HORIZONTAL } from './constants';

const AnimatedText = Animated.createAnimatedComponent(Text);

const ComponentAdornment = props => {
  const { disabled, renderItem, color, position, onLayoutAdornment } = props;

  if (!renderItem) return null;

  return (
    <View
      // pointerEvents={disabled ? 'none' : 'auto'}
      onLayout={e => onLayoutAdornment(e, position)}
      style={[styles.componentAdornment, { color }]}
    >
      {renderItem(props)}
    </View>
  );
};

const TextAdornment = props => {
  const {
    renderItem,
    position,
    style,
    onLayoutAdornment,
    hasActiveOutline,
    inputHasValue,
    topPosition,
  } = props;
  const { fontSize, color } = style;
  return (
    <AnimatedText
      onLayout={e => onLayoutAdornment(e, position)}
      style={[
        styles.adornmentText,
        {
          top: topPosition / 2,
          fontSize,
          color,
          opacity: hasActiveOutline || inputHasValue ? 1 : 0,
        },
      ]}
      numberOfLines={1}
    >
      {renderItem}
    </AnimatedText>
  );
};

const Adornment = props => {
  const { style, renderItem, padding, ...rest } = props;

  const isFunction = typeof renderItem === 'function';
  let isString = typeof renderItem === 'string';
  if (isFunction) {
    isString = typeof renderItem() === 'string';
  }
  // console.log(`isString: ${isString}`, `isFunction: ${isFunction}`, renderItem);

  const isVisible = isString
    ? props.hasActiveOutline || props.parentState.value
    : true;

  if (!isVisible) return null;

  const { fontSize, color, top, height, ...viewStyle } = style;
  const adormentStyle = { fontSize, color };

  const isLeft = props.position === 'left';
  const isRight = props.position === 'right';

  console.log(props);
  return (
    <View
      style={[
        styles.adornment,
        viewStyle,
        isLeft && styles.leftAdornment,
        isRight && styles.rightAdornment,
        padding === 'none' && styles.paddingNone,
      ]}
    >
      {isString ? (
        <TextAdornment
          renderItem={isFunction ? renderItem() : renderItem}
          style={adormentStyle}
          topPosition={top}
          inputHasValue={!!props.parentState.value}
          {...rest}
        />
      ) : (
        <ComponentAdornment
          renderItem={renderItem}
          style={adormentStyle}
          {...rest}
        />
      )}
    </View>
  );
};

export default Adornment;

const styles = StyleSheet.create({
  leftAdornment: {
    marginLeft: LABEL_PADDING_HORIZONTAL,
  },
  rightAdornment: {
    marginRight: LABEL_PADDING_HORIZONTAL,
  },
  paddingNone: {
    marginLeft: 0,
    marginRight: 0,
  },
  adornment: {
    // position: 'absolute',
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // top: 0,
    // backgroundColor: 'red',
  },
  adornmentText: {
    color: 'rgba(0, 0, 0, 0.54)',
    backgroundColor: 'green',
  },
  componentAdornment: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
