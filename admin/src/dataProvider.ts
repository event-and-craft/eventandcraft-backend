import { DataProvider } from 'react-admin';

const apiUrl = '/api';

const fetchWithAuth = async (url: string, options: any = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('admin_token');
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const flattenCategories = (categories: any[]): any[] => {
  let flat: any[] = [];
  for (const cat of categories) {
    const { children, ...rest } = cat;
    flat.push(rest);
    if (children && children.length > 0) {
      flat = flat.concat(flattenCategories(children));
    }
  }
  return flat;
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    let url = `${apiUrl}/${resource === 'users' ? 'user' : resource}`;
    
    // Add filtering/query support if needed
    const queryParts: string[] = [];
    if (params.filter) {
      Object.keys(params.filter).forEach(key => {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params.filter[key])}`);
      });
    }
    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }

    let data = await fetchWithAuth(url);

    // Handle categories nesting
    if (resource === 'categories') {
      data = flattenCategories(data);
    }

    // Support client-side sorting and pagination as NestJS endpoints return full lists
    if (params.sort) {
      const { field, order } = params.sort;
      data.sort((a: any, b: any) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA < valueB) return order === 'ASC' ? -1 : 1;
        if (valueA > valueB) return order === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const paginatedData = data.slice((page - 1) * perPage, page * perPage);

    return {
      data: paginatedData,
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    const data = await fetchWithAuth(`${apiUrl}/${resourcePath}/${params.id}`);
    return { data };
  },

  getMany: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    // Fallback: fetch one by one or fetch list and filter
    const url = `${apiUrl}/${resourcePath}`;
    const allData = await fetchWithAuth(url);
    const filtered = allData.filter((item: any) => params.ids.includes(item.id));
    return { data: filtered };
  },

  getManyReference: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    const url = `${apiUrl}/${resourcePath}?${params.target}=${params.id}`;
    const data = await fetchWithAuth(url);
    return {
      data,
      total: data.length,
    };
  },

  update: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    let url = `${apiUrl}/${resourcePath}/${params.id}`;
    let method = 'PUT';

    // Handle custom patch requests on categories and posts
    if (resource === 'categories' || resource === 'reviews') {
      method = 'PATCH';
    }

    let bodyData = params.data;
    if (resource === 'posts') {
      url = `${apiUrl}/posts/${params.id}/status`;
      method = 'PATCH';
      bodyData = { status: params.data.status };
    }

    const data = await fetchWithAuth(url, {
      method,
      body: JSON.stringify(bodyData),
    });

    return { data: { ...params.data, ...data } };
  },

  updateMany: async (resource, params) => {
    // Basic bulk updates mapping back to single updates
    const updates = params.ids.map(id =>
      dataProvider.update(resource, { id, data: params.data, previousData: {} })
    );
    await Promise.all(updates);
    return { data: params.ids };
  },

  create: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    const data = await fetchWithAuth(`${apiUrl}/${resourcePath}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    return { data };
  },

  delete: async (resource, params) => {
    const resourcePath = resource === 'users' ? 'user' : resource;
    const data = await fetchWithAuth(`${apiUrl}/${resourcePath}/${params.id}`, {
      method: 'DELETE',
    });
    return { data };
  },

  deleteMany: async (resource, params) => {
    const deletions = params.ids.map(id =>
      dataProvider.delete(resource, { id })
    );
    await Promise.all(deletions);
    return { data: params.ids };
  },
};
