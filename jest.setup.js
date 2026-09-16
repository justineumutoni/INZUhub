/* eslint-env jest */
// Tell React 19 that this is a valid act() environment
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock @expo/vector-icons globally so tests don't try to load native font assets
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => React.createElement(View, { testID: 'ionicons', ...props }),
    MaterialIcons: (props) => React.createElement(View, { testID: 'material-icons', ...props }),
    FontAwesome: (props) => React.createElement(View, { testID: 'font-awesome', ...props }),
    Feather: (props) => React.createElement(View, { testID: 'feather', ...props }),
    AntDesign: (props) => React.createElement(View, { testID: 'ant-design', ...props }),
  };
});
