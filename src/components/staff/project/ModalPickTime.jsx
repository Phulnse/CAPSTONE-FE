import { Divider, List, Modal, Select, message } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { memberReviewAPI } from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const ModalPickTime = ({ visible, onCancel, dataUser }) => {
  const [selectedTime, setSelectedTime] = useState(1);
  const [date, setDate] = useState(dayjs().add(1, "day"));
  const today = dayjs().format(dateFormat);
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];
  const handleTimeChange = (value) => {
    setDate(dayjs().add(value, "day"));
    setSelectedTime(value);
  };
  const createMemberApproval = async (data) => {
    try {
      const res = await memberReviewAPI(data);
      if (res && res?.isSuccess) {
        return res.isSuccess;
      }
    } catch (error) {
      console.log("failed to create member approval", error);
    }
  };
  const submit = () => {
    const userIDArray = dataUser.map((user) => user.id);

    const data = {
      topicId: topicId,
      memberReviewIds: userIDArray,
      numberOfDay: selectedTime,
    };
    const result = createMemberApproval(data);
    if (result) {
      message.success("Tạo thành viên phê duyệt thành công");
      navigate("/staff");
    } else {
      message.error("Lỗi tạo thành viên phê duyệt");
    }
  };

  return (
    <Modal
      title="Xác nhận thành viên và thời hạn phê duyệt"
      open={visible}
      onCancel={onCancel}
      okText={"Xác nhận thông tin"}
      cancelText={"Chỉnh sửa thông tin"}
      onOk={submit}
      forceRender={false}
      maskClosable={false}
    >
      <List
        header={<div>Danh sách thành viên phê duyệt</div>}
        bordered
        dataSource={dataUser}
        renderItem={(dataUser) => (
          <List.Item>
            {dataUser.fullName} - {dataUser.accountEmail} -{" "}
            {dataUser.phoneNumber}
          </List.Item>
        )}
      />
      <p style={{ width: "100%", marginTop: 20, fontWeight: "bold" }}>
        Thời hạn phê duyệt:
      </p>
      <p>
        Từ ngày: {today} - Đến ngày: {dayjs(date).format(dateFormat)}
      </p>
      <Select
        placeholder="Thời hạn phê duyệt"
        style={{ width: "100%" }}
        onChange={handleTimeChange}
        value={selectedTime}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((time) => (
          <Option key={time} value={time}>
            {time} ngày
          </Option>
        ))}
      </Select>
      <Divider />
    </Modal>
  );
};

export default ModalPickTime;
