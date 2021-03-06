const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
  console.log("In Signup Function")
  const password = await bcrypt.hash(args.password, 10)
  // 2
  const user = await context.db.mutation.createUser({
    data: { ...args, password },
  }, `{ id }`)

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 4
  return {
    token,
    user,
  }
}


//{
//  "authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamZvZXc0Z2x5ZG5qMGE0MnFiaTl6N2xyIiwiaWF0IjoxNTIzMDQ3MDU0fQ.e0yP-DExmdiZnK32Fgq3ecT6VkIqbTx3v78DCeCdyBw"
//}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamZvZXc0Z2x5ZG5qMGE0MnFiaTl6N2xyIiwiaWF0IjoxNTIzMDQ3MDU0fQ.e0yP-DExmdiZnK32Fgq3ecT6VkIqbTx3v78DCeCdyBw

async function login(parent, args, context, info) {
  // 1
  const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `)
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // 3
  return {
    token,
    user,
  }
}

function post(parent, args, context, info) {
  const userId = getUserId(context)
  // const userId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamZvZXc0Z2x5ZG5qMGE0MnFiaTl6N2xyIiwiaWF0IjoxNTIzMDQ3MDU0fQ.e0yP-DExmdiZnK32Fgq3ecT6VkIqbTx3v78DCeCdyBw"
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        
      },
    },
    info,
  )
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context);
  console.log("Inside of Vote Mutation");
  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId }
  })

  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId }},
      },
    },
    info,
  )
}


module.exports = {
    signup,
    login,
    post,
    vote,
}