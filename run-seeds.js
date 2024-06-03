import knex from 'knex'
import knexConfig from './server/db/knexfile.js'

const knexInstance = knex(knexConfig.development)

async function runSeeds() {
  try {
    console.log('Seeding users...')
    await knexInstance.seed.run({
      seedSource: 'users.js',
    })

    console.log('Seeding vocabulary...')
    await knexInstance.seed.run({
      seedSource: 'vocabulary.js',
    })
    console.log('Seeding phrases...')
    await knexInstance.seed.run({
      seedSource: 'phrases.js',
    })
    console.log('Seeding stories...')
    await knexInstance.seed.run({
      seedSource: 'stories.js',
    })
    console.log('Seeding user_vocabulary...')
    await knexInstance.seed.run({
      seedSource: 'user_vocabulary.js',
    })
    console.log('Seeding definitions...')
    await knexInstance.seed.run({
      seedSource: 'definitions.js',
    })
    console.log('Seeding word_forms...')
    await knexInstance.seed.run({
      seedSource: 'word_forms.js',
    })
    console.log('Seeding word_phrase_association...')
    await knexInstance.seed.run({
      seedSource: 'word_phrase_association.js',
    })
    console.log('Seeding phrase_translation...')
    await knexInstance.seed.run({
      seedSource: 'phrase_translation.js',
    })
    console.log('Seeding user_phrases...')
    await knexInstance.seed.run({
      seedSource: 'user_phrases.js',
    })

    console.log('All seeds run successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error running seeds:', error)
    process.exit(1)
  }
}

runSeeds()
