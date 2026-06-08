import {
  List,
  DataTable,
  Edit,
  SimpleForm,
  NumberInput,
  TextInput,
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
} from '@/components/admin';

export const ReviewList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <ReferenceField source="buyerId" reference="users" label="Buyer">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField source="creatorId" reference="users" label="Reviewed Creator">
        <TextField source="email" />
      </ReferenceField>
      <DataTable.Col source="rating" label="Rating" />
      <DataTable.Col source="description" label="Description" />
      <DataTable.Col source="createdAt" label="Created At" />
    </DataTable>
  </List>
);

export const ReviewEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="rating" label="Rating (1-5)" min={1} max={5} />
      <TextInput source="description" label="Description" multiline />
    </SimpleForm>
  </Edit>
);

export const ReviewShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <ReferenceField source="buyerId" reference="users" label="Buyer">
        <TextField source="email" />
      </ReferenceField>
      <ReferenceField source="creatorId" reference="users" label="Reviewed Creator">
        <TextField source="email" />
      </ReferenceField>
      <TextField source="rating" label="Rating" />
      <TextField source="description" label="Description" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);
