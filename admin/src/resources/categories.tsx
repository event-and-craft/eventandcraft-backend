import {
  List,
  DataTable,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
} from '@/components/admin';

export const CategoryList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" label="Category Name" />
      <DataTable.Col source="icon" label="Icon Class" />
      <DataTable.Col source="parentId" label="Parent ID" />
      <DataTable.Col source="isParent" label="Is Parent" />
      <DataTable.Col source="description" label="Description" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Category Name" />
      <TextInput source="icon" label="Icon Class Name" />
      <ReferenceInput source="parentId" reference="categories">
        <SelectInput optionText="name" label="Parent Category" />
      </ReferenceInput>
      <SelectInput
        source="isParent"
        label="Is Parent Category?"
        choices={[
          { id: 'true', name: 'Yes' },
          { id: 'false', name: 'No' },
        ]}
      />
      <TextInput source="description" label="Description" multiline rows={3} />
    </SimpleForm>
  </Edit>
);

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Category Name" />
      <TextInput source="icon" label="Icon Class Name" />
      <ReferenceInput source="parentId" reference="categories">
        <SelectInput optionText="name" label="Parent Category" />
      </ReferenceInput>
      <SelectInput
        source="isParent"
        label="Is Parent Category?"
        choices={[
          { id: 'true', name: 'Yes' },
          { id: 'false', name: 'No' },
        ]}
      />
      <TextInput source="description" label="Description" multiline rows={3} />
    </SimpleForm>
  </Create>
);

export const CategoryShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Category Name" />
      <TextField source="icon" label="Icon Class" />
      <ReferenceField source="parentId" reference="categories">
        <TextField source="name" label="Parent Category" />
      </ReferenceField>
      <TextField source="isParent" label="Is Parent" />
      <TextField source="description" label="Description" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
