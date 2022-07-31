import React, { CSSProperties, ReactNode, useMemo, useState } from 'react';
import { InboxOutlined, GithubOutlined } from '@ant-design/icons';
import {
  Layout,
  Typography,
  Upload,
  UploadProps,
  message,
  Grid,
  Tag,
  Space,
  Empty,
} from 'antd';
import { RcFile } from 'antd/lib/upload';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

import DataScreen from './DataScreen';

const Container = ({
  screen,
  children,
  style = {},
}: {
  screen: Breakpoint;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const getWidthFromScreen = (scr: Breakpoint) => {
    switch (scr) {
      case 'xs':
        return 480;
      case 'sm':
        return 576;
      case 'md':
        return 768;
      case 'lg':
        return 992;
      case 'xl':
        return 1200;
      case 'xxl':
        return 1600;
      default:
        return 992;
    }
  };
  return (
    <div
      style={{ maxWidth: getWidthFromScreen(screen), margin: 'auto', ...style }}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [selectedFile, setSelectedFile] = useState<undefined | RcFile>();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const currentBreakPoint: Breakpoint = useMemo(
    () =>
      Object.entries(screens).reduce(
        (prev, current) => (current[1] ? current[0] : prev) as Breakpoint,
        'xs' as Breakpoint
      ),
    [screens]
  );

  const props: UploadProps = {
    accept: '.json',
    beforeUpload: (file: RcFile, _fileList: RcFile[]) => {
      if (file) {
        setSelectedFile(file);
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          setData(JSON.parse(e.target?.result as string));
          message.success(`Processing file: ${file.name}`);
        };
        fileReader.onerror = (e) =>
          message.error(`Fail to read file, details: ${e.target?.result}`);

        fileReader.readAsText(file);
      }

      return false;
    },
    style: {
      marginBottom: 24,
    },
  };
  return (
    <div>
      <Layout>
        <Layout.Header
          style={{
            position: 'sticky',
            zIndex: 1,
            width: '100%',
            background: '#fff',
          }}
        >
          <Typography.Title style={{ textAlign: 'center' }}>
            Credential
          </Typography.Title>
        </Layout.Header>
        <Layout.Content>
          <Container screen={currentBreakPoint} style={{ marginBottom: 32 }}>
            <Space
              direction="vertical"
              size="large"
              style={{ display: 'flex' }}
            >
              <div
                style={{
                  textAlign: 'center',
                  paddingTop: 24,
                  marginBottom: 24,
                }}
              >
                <Typography.Text>
                  Current break point: {currentBreakPoint}
                </Typography.Text>
                <br />
                {Object.entries(screens)
                  .filter((screen) => !!screen[1])
                  .map((screen) => (
                    <Tag color="blue" key={screen[0]}>
                      {screen[0]}
                    </Tag>
                  ))}
              </div>
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to
                </p>
                <p className="ant-upload-hint">
                  Requirements: Type: .json | Content: Array of objects. This
                  will not send file to anywhere. If you refresh, close the tab
                  or select new file, the data will be reloaded.
                </p>
              </Upload.Dragger>
              <div>
                {selectedFile && data ? (
                  <DataScreen data={data} />
                ) : (
                  <Empty description="No data, please select data file." />
                )}
              </div>
            </Space>
          </Container>
        </Layout.Content>
        <Layout.Footer style={{ background: '#fff' }}>
          <Typography.Title style={{ textAlign: 'center' }} level={5}>
            <a
              href="https://github.com/hungmqn/credential"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined style={{ fontSize: 32 }} />
            </a>
          </Typography.Title>
        </Layout.Footer>
      </Layout>
    </div>
  );
};

export default App;
