
import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@0.21.1/+esm';

// IMPORTANT: Change this URL to your own PocketBase instance if needed
const PB_URL = 'https://pagedraft.pockethost.io'; 

export const pb = new PocketBase(PB_URL);

/**
 * Generates a full URL for a file stored in PocketBase.
 */
export const getFileUrl = (record: any, fileName: string, collectionNameOrId: string = 'posts') => {
  if (!fileName || !record?.id) return null;
  
  // PocketBase file URL structure: /api/files/COLLECTION_ID_OR_NAME/RECORD_ID/FILENAME
  const collection = record.collectionName || collectionNameOrId;
  return `${PB_URL}/api/files/${collection}/${record.id}/${fileName}`;
};

export const authService = {
  async requestPasswordReset(email: string) {
    return await pb.collection('users').requestPasswordReset(email);
  },
  
  async authWithOAuth2(provider: 'google' | 'github') {
    return await pb.collection('users').authWithOAuth2({ provider });
  },

  async updateProfile(id: string, data: any) {
    // data can be a plain object or FormData for file uploads
    const updated = await pb.collection('users').update(id, data);
    // Force a token refresh to update the local pb.authStore.model
    await pb.collection('users').authRefresh();
    return updated;
  }
};

export const blogService = {
  async getPosts(page = 1, perPage = 10, search = '', tag = '') {
    try {
      const now = new Date().toISOString().replace('T', ' ').split('.')[0];
      const filters: string[] = [];
      filters.push(`(status = "published" || (status = "scheduled" && publishedAt <= "${now}"))`);
      
      if (search) {
        const safeSearch = search.replace(/"/g, '\\"');
        filters.push(`(title ~ "${safeSearch}" || excerpt ~ "${safeSearch}")`);
      }
      if (tag) {
        const safeTag = tag.replace(/"/g, '\\"');
        filters.push(`tags ~ "${safeTag}"`);
      }

      const filterString = filters.join(' && ');

      return await pb.collection('posts').getList(page, perPage, {
        filter: filterString,
        sort: '-publishedAt,-created',
        expand: 'author',
      });
    } catch (error: any) {
      console.error('PB getPosts error:', error);
      return { items: [], totalItems: 0, totalPages: 0, page, perPage };
    }
  },

  async getPostsByAuthor(authorId: string, page = 1, perPage = 10) {
    try {
      if (!authorId) return { items: [], totalItems: 0, totalPages: 0, page, perPage };
      return await pb.collection('posts').getList(page, perPage, {
        filter: `author = "${authorId}"`,
        sort: '-created',
        expand: 'author',
      });
    } catch (error) {
      return { items: [], totalItems: 0, totalPages: 0, page, perPage };
    }
  },

  async getPostBySlug(slugOrId: string) {
    try {
      return await pb.collection('posts').getOne(slugOrId, { expand: 'author' });
    } catch (e) {
      try {
        return await pb.collection('posts').getFirstListItem(`slug="${slugOrId}"`, { expand: 'author' });
      } catch (innerError) {
        throw new Error("Post not found");
      }
    }
  },

  async toggleLike(postId: string) {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("Must be logged in to like");
    try {
      const existing = await pb.collection('likes').getFirstListItem(`post="${postId}" && user="${userId}"`);
      await pb.collection('likes').delete(existing.id);
      return false; 
    } catch (e) {
      await pb.collection('likes').create({ post: postId, user: userId });
      await this.logActivity(userId, 'like', 'liked a draft', `#/blog/${postId}`);
      return true;
    }
  },

  async getLikeCount(postId: string) {
    try {
      const result = await pb.collection('likes').getList(1, 1, { filter: `post="${postId}"`, fields: 'id' });
      return result.totalItems;
    } catch (e) { return 0; }
  },

  async hasUserLiked(postId: string) {
    const userId = pb.authStore.model?.id;
    if (!userId) return false;
    try {
      await pb.collection('likes').getFirstListItem(`post="${postId}" && user="${userId}"`, { fields: 'id' });
      return true;
    } catch (e) { return false; }
  },

  async logActivity(userId: string, type: 'comment' | 'like' | 'post', description: string, link: string) {
    try { await pb.collection('activities').create({ user: userId, type, description, link }); } catch (e) {}
  },

  async getUserActivities(userId: string) {
    try {
      return await pb.collection('activities').getList(1, 15, { filter: `user="${userId}"`, sort: '-created' });
    } catch (e) { return { items: [] }; }
  },

  async getComments(postId: string, page = 1, perPage = 20) {
    try {
      return await pb.collection('comments').getList(page, perPage, { filter: `post="${postId}"`, sort: '-created', expand: 'user' });
    } catch (error) { return { items: [], totalItems: 0, totalPages: 0, page, perPage }; }
  },

  async createComment(postId: string, content: string) {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("Must be logged in to comment");
    const comment = await pb.collection('comments').create({ post: postId, user: userId, content: content });
    await this.logActivity(userId, 'comment', 'commented on a draft', `#/blog/${postId}`);
    return comment;
  },

  async createPost(formData: FormData) {
    const post = await pb.collection('posts').create(formData);
    const userId = pb.authStore.model?.id;
    if (userId) { await this.logActivity(userId, 'post', 'published a new draft', `#/blog/${post.id}`); }
    return post;
  },

  async updatePost(id: string, formData: FormData) {
    return await pb.collection('posts').update(id, formData);
  },

  async deletePost(id: string) {
    return await pb.collection('posts').delete(id);
  }
};
