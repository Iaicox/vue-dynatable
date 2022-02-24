const req = require.context('./', true, /.filter.js$/)
const keys = req.keys()
const modules = keys
	.map(req)
	.reduce((obj, filter, i) => {
		const key = keys[i].replace(/^\.\/(.*)\.filter.js$/gm, '$1').replace(/[\/\\]/gm, '--')
		if (key)
			obj[key] = filter.default

		return obj
	}, {})
module.exports = modules