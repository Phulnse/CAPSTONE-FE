import {
  CheckOutlined,
  CloseOutlined,
  FundViewOutlined,
  InfoCircleOutlined,
  ScheduleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Badge, Button, ConfigProvider, Input, Space, Table, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "../../staff/project/project.scss";
import { useNavigate } from "react-router-dom";
import "./table.scss";
import { getTopicByUserId } from "../../../services/api";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalMeetingInfor from "./ModalMeetingInfor";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
// import ModalInfor from "../../modalInfor.jsx";
const ProjectForTrack = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [dataTopicForMember, setdataTopicForMember] = useState([]);
  const [isModalInforOpen, setIsModalInforOpen] = useState(false);
  const [data, setDataUser] = useState({});
  const getProjectProcess = async () => {
    try {
      const res = await getTopicByUserId({
        userId: localStorage.getItem("userId"),
      });
      if (res && res.isSuccess) {
        setdataTopicForMember(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại theo dõi đề tài: " + error.message);
      console.log("====================================");
    }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      color: "red",
      width: "10%",
    },
    {
      title: "Tên Đề Tài",
      dataIndex: "topicName",
      key: "topicName",
      ...getColumnSearchProps("topicName"),
      width: "30%",
    },
    {
      title: "Lĩnh Vực",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Ngày tạo",
      render: (text, record, index) => {
        return <div>{dayjs(record.createdAt).format(dateFormat)}</div>;
      },
      key: "createdAt",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        const style2 = {
          color: "green",
          fontSize: "20px",
          margin: "0 10px",
          cursor: "pointer",
        };
        const style1 = {
          color: "black",
          fontSize: "20px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        return (
          <div>
            <FundViewOutlined
              onClick={() => {
                navigate(`/user/track/track-topic/${record.topicId}`);
              }}
              style={style1}
            />
            <Badge dot offset={[-10, 0]}>
              <ScheduleOutlined
                onClick={() => {
                  setDataUser(record);
                  setIsModalInforOpen(true);
                }}
                style={style2}
              />
            </Badge>
          </div>
        );
      },
      align: "center",
    },
  ];

  //search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("parms: ", pagination, filters, sorter, extra);
  };
  useEffect(() => {
    getProjectProcess();
  }, []);
  return (
    <>
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Theo dõi tiến độ đề tài
      </h2>
      <ConfigProvider locale={viVN}>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          bordered={true}
          columns={columns}
          dataSource={dataTopicForMember}
          onChange={onChange}
          rowKey={"_id"}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15"],
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} on {total} rows
                </div>
              );
            },
          }}
        />
      </ConfigProvider>
      <ModalMeetingInfor
        data={data}
        isModalOpen={isModalInforOpen}
        setIsModalOpen={setIsModalInforOpen}
      />
    </>
  );
};

export default ProjectForTrack;
