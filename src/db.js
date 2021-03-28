const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];

const comments = [
  {
    id: "100",
    text: "This was a good book",
    author: "1",
    post: "10",
  },
  {
    id: "101",
    text: "This was a bad book",
    author: "2",
    post: "10",
  },
  {
    id: "102",
    text: "This wa an amazing read",
    author: "2",
    post: "11",
  },
  {
    id: "103",
    text: "This was a a waste of time",
    author: "1",
    post: "12",
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "2",
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2",
  },
];

const db = { users, posts, comments };
export { db as default };
