import { useRecordContext } from 'react-admin';
import {
  List,
  DataTable,
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
} from '@/components/admin';

const CmsFormFields = () => {
  const record = useRecordContext();
  if (!record) return null;

  if (record.key === 'banners') {
    return (
      <div className="flex flex-col gap-4 w-full">
        <TextInput source="key" label="Key" disabled className="max-w-md" />
        <TextInput source="description" label="Description" className="max-w-xl" />
        <ArrayInput source="value" label="Banners List">
          <SimpleFormIterator>
            <TextInput source="backgroundImageUrl" label="Background Image URL" className="w-full" />
            <TextInput source="title" label="Title" className="w-full" />
            <TextInput source="subtitle" label="Subtitle" className="w-full" />
            <TextInput source="description" label="Description" multiline rows={3} className="w-full" />
          </SimpleFormIterator>
        </ArrayInput>
      </div>
    );
  }

  if (record.key === 'testimonials') {
    return (
      <div className="flex flex-col gap-4 w-full">
        <TextInput source="key" label="Key" disabled className="max-w-md" />
        <TextInput source="description" label="Description" className="max-w-xl" />
        <ArrayInput source="value" label="Testimonials List">
          <SimpleFormIterator>
            <TextInput source="content" label="Testimonial / Review Content" multiline rows={3} className="w-full" />
            <TextInput source="profileImg" label="Profile Image URL" className="w-full" />
            <TextInput source="name" label="Customer Name" className="w-full" />
            <TextInput source="designation" label="Designation (e.g. Happy Bride, Event Organizer)" className="w-full" />
          </SimpleFormIterator>
        </ArrayInput>
      </div>
    );
  }

  // Fallback editor
  return (
    <div className="flex flex-col gap-4 w-full">
      <TextInput source="key" label="Key" disabled className="max-w-md" />
      <TextInput source="description" label="Description" className="max-w-xl" />
      <TextInput source="value" label="Value (JSON String)" multiline rows={10} className="w-full" />
    </div>
  );
};

export const CmsEdit = () => (
  <Edit>
    <SimpleForm>
      <CmsFormFields />
    </SimpleForm>
  </Edit>
);

export const CmsList = () => (
  <List>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="key" label="Configuration Key" />
      <DataTable.Col source="description" label="Description" />
      <DataTable.Col source="updatedAt" label="Last Updated" />
    </DataTable>
  </List>
);
