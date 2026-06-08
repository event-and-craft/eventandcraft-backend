import {
  List,
  DataTable,
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  EmailField,
  DateField,
} from '@/components/admin';

export const UserList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="firstName" label="First Name" />
      <DataTable.Col source="lastName" label="Last Name" />
      <DataTable.Col source="email" label="Email" />
      <DataTable.Col source="phoneNumber" label="Phone" />
      <DataTable.Col source="isActive" label="Active" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="firstName" label="First Name" />
      <TextInput source="lastName" label="Last Name" />
      <TextInput source="email" label="Email" />
      <TextInput source="phoneNumber" label="Phone" />
      <BooleanInput source="isActive" label="Active" />
    </SimpleForm>
  </Edit>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="firstName" label="First Name" />
      <TextField source="lastName" label="Last Name" />
      <EmailField source="email" label="Email" />
      <TextField source="phoneNumber" label="Phone" />
      <BooleanField source="isActive" label="Active" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
