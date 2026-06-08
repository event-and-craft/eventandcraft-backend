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

export const LocationList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" label="Location Name" />
      <DataTable.Col source="description" label="Description" />
      <DataTable.Col source="status" label="Status" />
      <DataTable.Col source="mapPointer" label="Map Pointer" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const LocationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Location Name" />
      <TextInput source="description" label="Description" multiline rows={3} />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ]}
      />
      <TextInput source="mapPointer" label="Map Pointer" />
    </SimpleForm>
  </Edit>
);

export const LocationCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Location Name" />
      <TextInput source="description" label="Description" multiline rows={3} />
      <SelectInput
        source="status"
        label="Status"
        defaultValue="active"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'inactive', name: 'Inactive' },
        ]}
      />
      <TextInput source="mapPointer" label="Map Pointer" />
    </SimpleForm>
  </Create>
);

export const LocationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Location Name" />
      <TextField source="description" label="Description" />
      <TextField source="status" label="Status" />
      <TextField source="mapPointer" label="Map Pointer" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
