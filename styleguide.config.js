module.exports = {
  webpackConfig: require('./front/config/webpack.config'),
  skipComponentsWithoutExample: true,
  components: 'front/src/app/components/**/*.tsx',
  context: {
    _: 'lodash',
    mobx: 'mobx',
    mobxReact: 'mobx-react',
    moment: 'moment',
  },
  styles: {
    Playground: {
      preview: {
        fontFamily:  "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif ",
        fontSize: "14px",
      },
    },
  },
  propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
  require: [
    './front/src/app/components/index.less',
  ],
};