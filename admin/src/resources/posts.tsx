import {
  List,
  DataTable,
  Edit,
  SimpleForm,
  SelectInput,
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
} from '@/components/admin';

export const PostList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <ReferenceField source="creatorId" reference="users" label="Creator">
        <TextField source="email" />
      </ReferenceField>
      <DataTable.Col source="content" label="Content Preview" />
      <DataTable.Col source="status" label="Status" />
      <DataTable.Col source="likesCount" label="Likes" />
      <DataTable.Col source="commentsCount" label="Comments" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput
        source="status"
        label="Post Status"
        choices={[
          { id: 'draft', name: 'Draft' },
          { id: 'published', name: 'Published' },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const PostShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ReferenceField source="creatorId" reference="users" label="Creator">
        <TextField source="email" />
      </ReferenceField>
      <TextField source="content" label="Content" />
      <TextField source="status" label="Status" />
      <TextField source="likesCount" label="Likes Count" />
      <TextField source="commentsCount" label="Comments Count" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
