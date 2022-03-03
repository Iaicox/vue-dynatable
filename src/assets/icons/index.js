const req = require.context('./', true, /.svg$/)
const keys = req.keys()
const modules = keys
	.map(req)
	.reduce((obj, path, i) => {
		const key = keys[i].replace(/^\.\/(.*)\.svg$/gm, '$1').replace(/[\/\\]/gm, '--')
		if (process.env.NODE_ENV === 'production')
			path = '/img/' + key + '.svg'

		if (key)
			obj = {
				...obj,
				[key]: path,
			}

		return obj
	}, {})
module.exports = modules