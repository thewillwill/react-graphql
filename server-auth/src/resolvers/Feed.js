function links(parent, args, context, info) {
	return context.db.query.links({ where: { id_in: parent.linkIds }})
}

module.exports = {
	links,
}