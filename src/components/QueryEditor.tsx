import { QueryEditorProps } from '@grafana/data';
import React, { ChangeEvent } from 'react';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ query, onChange, onRunQuery }) => {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
    onRunQuery();
  };

  console.log('QueryEditor');

  return (
    <div className="gf-form">
      <span className="gf-form-label width-8">User ID</span>
      <input
        type="text"
        className="gf-form-input"
        value={query.queryText || ''}
        onChange={onQueryTextChange}
        placeholder="Enter User ID variable"
      />
    </div>
  );
};

// export function QueryEditor({ query, onChange, onRunQuery }: Props) {
//   const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
//     onChange({ ...query, queryText: event.target.value });
//   };

//   const onConstantChange = (event: ChangeEvent<HTMLInputElement>) => {
//     onChange({ ...query, constant: parseFloat(event.target.value) });
//     // executes the query
//     onRunQuery();
//   };

//   const { queryText, constant } = query;

//   console.log('QueryEditor')

//   return (
//     <Stack gap={0}>
//       <InlineField label="Constant">
//         <Input
//           id="query-editor-constant"
//           onChange={onConstantChange}
//           value={constant}
//           width={8}
//           type="number"
//           step="0.1"
//         />
//       </InlineField>
//       <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
//         <Input
//           id="query-editor-query-text"
//           onChange={onQueryTextChange}
//           value={queryText || ''}
//           required
//           placeholder="Enter a query"
//         />
//       </InlineField>
//     </Stack>
//   );
// }
