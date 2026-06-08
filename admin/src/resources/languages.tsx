import {
  List,
  DataTable,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
} from '@/components/admin';

export const LanguageList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" label="Language Name" />
      <DataTable.Col source="code" label="Language Code" />
      <DataTable.Col source="status" label="Status" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const LanguageEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Language Name" />
      <TextInput source="code" label="Language Code" />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const LanguageCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Language Name" />
      <TextInput source="code" label="Language Code" />
      <SelectInput
        source="status"
        label="Status"
        defaultValue="active"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ]}
      />
    </SimpleForm>
  </Create>
);

export const LanguageShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Language Name" />
      <TextField source="code" label="Language Code" />
      <TextField source="status" label="Status" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
