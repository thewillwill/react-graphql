function feed(parents, argsg, context, info) {
	return context.db.link({}, info)
}

module.exports = {
	feed,
}