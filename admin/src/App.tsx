import { Resource } from 'react-admin';
import { Admin } from '@/components/admin';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { UserList, UserEdit, UserCreate, UserShow } from './resources/users';
import { CategoryList, CategoryEdit, CategoryCreate, CategoryShow } from './resources/categories';
import { PostList, PostEdit, PostShow } from './resources/posts';
import { ReviewList, ReviewEdit, ReviewShow } from './resources/reviews';
import { LocationList, LocationEdit, LocationCreate, LocationShow } from './resources/locations';
import { LanguageList, LanguageEdit, LanguageCreate, LanguageShow } from './resources/languages';
import { CmsList, CmsEdit } from './resources/cms';
import { Users, FolderTree, FileText, MessageSquare, MapPin, Globe, Sliders } from 'lucide-react';

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      show={UserShow}
      icon={Users}
      options={{ label: 'Users' }}
    />
    <Resource
      name="categories"
      list={CategoryList}
      edit={CategoryEdit}
      create={CategoryCreate}
      show={CategoryShow}
      icon={FolderTree}
      options={{ label: 'Categories' }}
    />
    <Resource
      name="posts"
      list={PostList}
      edit={PostEdit}
      show={PostShow}
      icon={FileText}
      options={{ label: 'Posts' }}
    />
    <Resource
      name="reviews"
      list={ReviewList}
      edit={ReviewEdit}
      show={ReviewShow}
      icon={MessageSquare}
      options={{ label: 'Reviews' }}
    />
    <Resource
      name="locations"
      list={LocationList}
      edit={LocationEdit}
      create={LocationCreate}
      show={LocationShow}
      icon={MapPin}
      options={{ label: 'Locations' }}
    />
    <Resource
      name="languages"
      list={LanguageList}
      edit={LanguageEdit}
      create={LanguageCreate}
      show={LanguageShow}
      icon={Globe}
      options={{ label: 'Languages' }}
    />
    <Resource
      name="cms"
      list={CmsList}
      edit={CmsEdit}
      icon={Sliders}
      options={{ label: 'CMS Settings' }}
    />
  </Admin>
);

export default App;
