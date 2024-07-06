# Language Buddy

## Setup

You will need to create an openAI API key and place it in a .env file at the root like: API_KEY='uhver...'

## Why I'm building this app
My wife is half German & speaks mostly German to my daughter. So I've been learning German too. Apps that I have been using are great or vocabulary, but it's still difficult to express myself in German.

## How language-buddy solves the problem
The main feature is that you can enter a story in English, can be a journal entry, a song or anything. Then try your best to express the same story in German. And hit submit. Language buddy will send the 2 stories to the chatGPT API, and compare them to give you a correct translation, find out what words you need to add to your vocab & give you some sentences to learn to express those things.

### Short-term plans
Authentication - so it can be deployed & users can log in
Dojo - Practice your sentences
Adjust Database processing - at the moment phrases are automatically added to the DB where everyone can see, I want to give more control to users, so that any phrases containing sensitive information won't be accessible to other users.
Add payment processing so that I can afford to keep it deployed.

### Long-term plans
Users can easily add a word in english/german that they don't know or want to practice.
Type in just an english phrase to get the translation and add to Dojo.
Improve styling.
Make available in multiple languages.
Add differenting interesting prompts, to inspire diverse entries and a broad subject matter.
Allow users to create their own prompts & favourite others.

### Installation

#### **From the command line**

```
git clone git@github.com:andrew-molten/language-buddy.git
cd language-buddy
npm install # to install dependencies
npm run knex migrate:latest # to build database tables
npm run dev # to start the dev server
```

You can find the server running on [http://localhost:3000](http://localhost:3000) and the client running on [http://localhost:5173](http://localhost:5173).

---
