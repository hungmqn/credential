import {
  flow,
  flatMap,
  keysIn,
  flatten,
  uniq,
  without,
  getOr,
  map,
  filter,
  debounce,
} from 'lodash/fp';
import { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Empty,
  Form,
  Checkbox,
  Row,
  Col,
  Table,
  Input,
} from 'antd';
import { ColumnType } from 'antd/lib/table';

type DataScreenProps = {
  data: Array<any>;
};

const getFields = flow(
  flatMap((obj) => keysIn(obj)),
  flatten,
  uniq,
  without(['key'])
);

const fieldsToColumns = flatMap((field) => ({
  title: field,
  dataIndex: field,
  key: field,
  render: (text: any, record: any, index: number) => {
    if (typeof text === 'object') {
      return <pre>{JSON.stringify(text, null, 2)}</pre>;
    }
    return text;
  },
}));

const processInitialData = (data: Array<any>) =>
  data.map((dataRow, index) => {
    return {
      key: index.toFixed(2),
      ...dataRow,
    };
  });

const searchData = (search: string) =>
  flow(
    map((record) => JSON.stringify(record)),
    filter((value: string) => value.toLocaleLowerCase().indexOf(search) >= 0),
    map((record) => JSON.parse(record))
  );

const DataScreen = ({ data = [] }: DataScreenProps) => {
  const originData = useMemo(() => processInitialData(data), [data]);
  const [filteredData, setFilteredData] = useState<any>();
  const fields = useMemo(() => getFields(originData), [originData]);
  const [form] = Form.useForm();
  const selectedFields = Form.useWatch('selectedFields', form);
  const columns = fieldsToColumns(selectedFields) as ColumnType<any>[];

  const handleApplyFilter = (_: any, values: any) => {
    const search = getOr('', 'search')(values);
    setFilteredData(searchData(search.toLocaleLowerCase())(originData));
  };

  useEffect(() => {
    setFilteredData(originData);
  }, [originData]);

  return data.length > 0 ? (
    <div style={{ background: '#fff', padding: 24 }}>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          selectedFields: fields,
        }}
        onValuesChange={debounce(500, handleApplyFilter)}
      >
        <Typography.Title level={5} style={{ marginBottom: 24 }}>
          Select fields to show
        </Typography.Title>
        <div>
          <Form.Item name="selectedFields">
            <Checkbox.Group>
              <Row gutter={[24, 24]}>
                {fields.length > 0 &&
                  fields.map((field) => (
                    <Col span={4} key={field}>
                      <Checkbox value={field}>{field}</Checkbox>
                    </Col>
                  ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="search">
            <Input placeholder="Search for all fields" />
          </Form.Item>
        </div>
        <Table
          bordered
          sticky
          tableLayout="fixed"
          dataSource={filteredData}
          columns={columns}
        />
      </Form>
    </div>
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="The file you select doesn't contain proper data, please select another file."
    />
  );
};

export default DataScreen;
