module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					extensions: ['.js', '.json'],
					alias: {
						'@': './'
					},
				},
			],
			['@babel/plugin-proposal-decorators', { legacy: true }],
			'inline-dotenv',
			'@babel/plugin-proposal-export-namespace-from',
			'react-native-reanimated/plugin',
		]
  };
};
