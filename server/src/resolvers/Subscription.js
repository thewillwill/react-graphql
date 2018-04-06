function newLinkSubscribe (parent, args, context, info) {
	return context.db.subscription.link(
		// https://github.com/graphcool/prisma/issues/1734
    	// { where: { mutation_in: ['CREATED'] } },
		{},
		info,
	)
}

function newVoteSubscribe (parents, args, context, info) {
	return context.db.subscription.vote(
		// https://github.com/graphcool/prisma/issues/1734
    	// { where: { mutation_in: ['CREATED'] } },
    	{},
    	info,
		)
}

const newLink = {
	subscribe: newLinkSubscribe
}

const newVote = {
	subscribe: newVoteSubscribe
}

module.exports = {
	newLink,
	newVote,
}