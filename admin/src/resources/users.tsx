import {
  List,
  DataTable,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  SelectField,
  ImageField,
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  FileInput,
} from '@/components/admin';
import { required, email } from 'react-admin';

export const UserList = () => (
  <List>
    <DataTable>
      <DataTable.Col label="Avatar">
        <ImageField source="profileImg" className="[&_img]:w-8 [&_img]:h-8 [&_img]:rounded-full [&_img]:object-cover border" />
      </DataTable.Col>
      <DataTable.Col source="name" label="Name" />
      <DataTable.Col source="username" label="Username" />
      <DataTable.Col source="email" label="Email" />
      <DataTable.Col source="mobile" label="Phone" />
      <DataTable.Col label="Type">
        <SelectField
          source="userType"
          choices={[
            { id: 0, name: 'Admin' },
            { id: 1, name: 'User' },
            { id: 2, name: 'Creator' },
          ]}
        />
      </DataTable.Col>
      <DataTable.Col source="status" label="Status" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <FileInput source="profileImg" label="Profile Image" accept={{ 'image/*': [] }}>
        <ImageField source="src" className="[&_img]:w-24 [&_img]:h-24 [&_img]:object-cover [&_img]:rounded-full border border-border" />
      </FileInput>
      <TextInput source="name" label="Name" />
      <TextInput source="username" label="Username" validate={[required()]} />
      <TextInput source="email" label="Email" validate={[required(), email()]} />
      <TextInput type="password" source="password" label="New Password (optional)" />
      <TextInput source="mobile" label="Phone" />
      <SelectInput
        source="userType"
        label="User Type"
        choices={[
          { id: 1, name: 'User' },
          { id: 2, name: 'Creator' },
        ]}
      />
      <SelectInput
        source="status"
        label="Status"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'blocked', name: 'Blocked' },
          { id: 'pending-verification', name: 'Pending Verification' },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <FileInput source="profileImg" label="Profile Image" accept={{ 'image/*': [] }}>
        <ImageField source="src" className="[&_img]:w-24 [&_img]:h-24 [&_img]:object-cover [&_img]:rounded-full border border-border" />
      </FileInput>
      <TextInput source="name" label="Name" />
      <TextInput source="username" label="Username" validate={[required()]} />
      <TextInput source="email" label="Email" validate={[required(), email()]} />
      <TextInput type="password" source="password" label="Password" validate={[required()]} />
      <TextInput source="mobile" label="Phone" />
      <SelectInput
        source="userType"
        label="User Type"
        defaultValue={1}
        choices={[
          { id: 1, name: 'User' },
          { id: 2, name: 'Creator' },
        ]}
      />
      <SelectInput
        source="status"
        label="Status"
        defaultValue="active"
        choices={[
          { id: 'active', name: 'Active' },
          { id: 'blocked', name: 'Blocked' },
          { id: 'pending-verification', name: 'Pending Verification' },
        ]}
      />
    </SimpleForm>
  </Create>
);

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ImageField source="profileImg" label="Avatar" className="[&_img]:w-20 [&_img]:h-20 [&_img]:rounded-full [&_img]:object-cover border" />
      <TextField source="name" label="Name" />
      <TextField source="username" label="Username" />
      <EmailField source="email" label="Email" />
      <TextField source="mobile" label="Phone" />
      <SelectField
        source="userType"
        label="User Type"
        choices={[
          { id: 0, name: 'Admin' },
          { id: 1, name: 'User' },
          { id: 2, name: 'Creator' },
        ]}
      />
      <TextField source="status" label="Status" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
