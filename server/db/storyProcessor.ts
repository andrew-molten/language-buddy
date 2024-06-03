import connection from './connection.ts'

export async function saveStory(db = connection): Promise<> {
  // return db('fruit').select()
}
// will need to use a transaction

// collect the original stories from the request, to add with the data we get back (fs.writefile maybe?)
