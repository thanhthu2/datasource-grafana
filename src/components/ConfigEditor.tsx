import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import React from 'react';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export function ConfigEditor(props: Props) {
  return <></>;
}
