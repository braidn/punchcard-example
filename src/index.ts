import { Core, DynamoDB, Lambda } from 'punchcard';
import { string, timestamp, Type } from '@punchcard/shape'
import * as uuid from 'uuid'

export const app = new Core.App();
const stack = app.stack('punchcard-test')

class Post extends Type({
  postID: string,
  postTime: timestamp,
  postContent: string
}) {}

const table = new DynamoDB.Table(stack, 'PostTable', {
  data: Post,
  key: {
    partition: 'postID'
  }
})

class SendPostRequest extends Type({
  content: string
}) {}

const postFunction = new Lambda.Function(stack, 'PostFunction', {
  request: SendPostRequest,
  response: Post,
  depends: table.writeAccess(),
}, async (request, table) => {
  const post = new Post({
    postID: uuid.v4(),
    postTime: new Date(),
    postContent: request.content
  })


  return await table.put(post)
})
