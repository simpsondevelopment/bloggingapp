import bcrypt from "bcryptjs";
import hashPassword from "../utils/hashPassword";

import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });
    return {
      user,
      token: generateToken(user.id),
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("No user exists to delete");
    }

    return prisma.mutation.deleteUser({
      where: {
        id: userId,
      },
    });
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("No user found");
    }

    const givenPassword = args.data.password;

    const isMatch = bcrypt.compare(givenPassword, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return {
      user,
      token: generateToken(user.id),
    };
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("Operation failed");
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id,
      },
    });
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    const postPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (!postExists) {
      throw new Error("Operation failed");
    }

    if (postPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: args.id },
        },
      });
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const isPublished = await prisma.exists.Post({
      published: true,
      id: args.data.post,
    });

    if (!isPublished) {
      throw new Error("Post not published");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Could not delete Comment");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Comment Failed to Update");
    }

    return prisma.mutation.updateComment(
      {
        data: args.data,

        where: {
          id: args.id,
        },
      },
      info
    );
  },
};

export { Mutation as default };
