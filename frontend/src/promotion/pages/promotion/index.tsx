import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Row,
  Col,
  message,
  Modal,
  Input,
  Select,
  Drawer,
  ConfigProvider,
} from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import {
  GetPromotions,
  DeletePromotionById,
  GetPromotionType,
  GetPromotionStatus,
  GetDiscountType,
} from "../../service/htpps/PromotionAPI";
import { PromotionInterface } from "../../interface/Promotion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import enUS from "antd/locale/en_US";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [promotionTypes, setPromotionTypes] = useState<Record<number, string>>({});
  const [promotionStatuses, setPromotionStatuses] = useState<Record<number, string>>({});
  const [promotionDiscounts, setPromotionDiscounts] = useState<Record<number, string>>({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionInterface | null>(null);
  const [searchCode, setSearchCode] = useState<string>("");

  const [filters, setFilters] = useState({
    type_id: null,
    status_id: null,
    discount_id: null,
  });

  const columns: ProColumns<PromotionInterface>[] = [
    { title: "รหัส", dataIndex: "ID", key: "id", valueType: "indexBorder" },
    { title: "รหัสโปรโมชั่น", dataIndex: "code", key: "code", copyable: true },
    { title: "ชื่อโปรโมชั่น", dataIndex: "name", key: "name" },
    { title: "รายละเอียด", dataIndex: "details", key: "details" },
    {
      title: "ระยะเวลาโปรโมชั่น",
      key: "date_range",
      render: (record) =>
        record.start_date && record.end_date
          ? `${dayjs(record.start_date).format("DD/MM/YYYY")} ถึง ${dayjs(record.end_date).format("DD/MM/YYYY")}`
          : "-",
    },
    {
      title: "ประเภทส่วนลด",
      key: "discount_id",
      render: (record) => promotionDiscounts[record.discount_id] || "-",
    },
    {
      title: "ส่วนลด",
      key: "discount",
      render: (record) => {
        if (record.discount || record.discount === "0") {
          if (record.discount_id === 1) {
            return `${record.discount}%`;
          } else if (record.discount_id === 2) {
            return `${record.discount}฿`;
          }
        }
        return "-";
      },
    },
    { title: "ส่วนลดสูงสุด (฿)", dataIndex: "limit_discount", key: "limit_discount", valueType: "money" },
    { title: "ราคาขั้นต่ำ (฿)", dataIndex: "minimum_price", key: "minimum_price", valueType: "money" },
    { title: "จำนวนที่จำกัด", dataIndex: "limit", key: "limit" },
    { title: "ที่ใช้แล้ว (ครั้ง)", dataIndex: "count_limit", key: "count_limit" },
    {
      title: "สถานะ",
      dataIndex: "status_id",
      valueType: "select",
      valueEnum: {
        1: { text: "เปิดใช้งาน", status: "Success" },
        2: { text: "เต็ม", status: "Error" },
        3: { text: "หมดอายุ", status: "Warning" },
        4: { text: "ยกเลิก", status: "Default" },
      },
    },
    {
      title: "ประเภท",
      key: "type_id",
      render: (record) => promotionTypes[record.type_id] || "-",
    },
    {
      title: "การกระทำ",
      key: "action",
      valueType: "option",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/promotion/edit/${record.ID}`)}
            style={{
              borderRadius: "8px",
              fontSize: "14px",
              padding: "8px 16px",
              backgroundColor: "#003366",
              color: "white",
            }}
          >
            แก้ไข
          </Button>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            style={{ borderRadius: "8px", fontSize: "14px", padding: "8px 16px" }}
            onClick={() => showDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  const showDeleteModal = (record: PromotionInterface) => {
    setSelectedPromotion(record);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedPromotion) return;
    const res = await DeletePromotionById(selectedPromotion.ID);
    if (res.status === 200) {
      messageApi.open({ type: "success", content: res.data.message });
      await getPromotions();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถลบโปรโมชั่นได้",
      });
    }
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const getPromotions = async () => {
    const res = await GetPromotions();
    if (res.status === 200) {
      setPromotions(res.data);
    } else {
      setPromotions([]);
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดโปรโมชั่นได้",
      });
    }
  };

  const getPromotionTypes = async () => {
    const res = await GetPromotionType();
    if (res.status === 200) {
      const typeMap = res.data.reduce(
        (acc: Record<number, string>, type: { ID: number; type: string }) => {
          acc[type.ID] = type.type;
          return acc;
        },
        {}
      );
      setPromotionTypes(typeMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดประเภทโปรโมชั่นได้",
      });
    }
  };

  const getPromotionStatuses = async () => {
    const res = await GetPromotionStatus();
    if (res.status === 200) {
      const statusMap = res.data.reduce(
        (acc: Record<number, string>, status: { ID: number; status: string }) => {
          acc[status.ID] = status.status;
          return acc;
        },
        {}
      );
      setPromotionStatuses(statusMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดสถานะโปรโมชั่นได้",
      });
    }
  };

  const getPromotionDiscounts = async () => {
    const res = await GetDiscountType();
    if (res.status === 200) {
      const discountMap = res.data.reduce(
        (acc: Record<number, string>, discount: { ID: number; discount_type: string }) => {
          acc[discount.ID] = discount.discount_type;
          return acc;
        },
        {}
      );
      setPromotionDiscounts(discountMap);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error || "ไม่สามารถโหลดประเภทส่วนลดได้",
      });
    }
  };

  const applyFilters = () => {
    setIsFilterDrawerOpen(false);
  };

  useEffect(() => {
    getPromotions();
    getPromotionTypes();
    getPromotionStatuses();
    getPromotionDiscounts();
  }, []);

  return (
    <ConfigProvider locale={enUS}>
      <div
        style={{
          maxWidth: "80%",
          margin: "0 auto",
          backgroundColor: "white",
          border: "1px solid #003366",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: "Kanit, sans-serif",
        }}
      >
        {contextHolder}

        <Row style={{ marginBottom: "20px" }}>
          <Col span={12}>
            <h2 style={{ fontSize: "36px", fontFamily: "Kanit, sans-serif" }}>จัดการโปรโมชั่น</h2>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => navigate("/promotion/create")}
              style={{ fontSize: "16px", backgroundColor: "#003366", color: "white", marginRight: 8 }}
            >
              สร้างโปรโมชั่น
            </Button>
          </Col>
        </Row>

        <ProTable<PromotionInterface>
          rowKey="ID"
          columns={columns}
          dataSource={promotions.filter((promotion) => {
            const { type_id, status_id, discount_id } = filters;
            return (
              (!type_id || promotion.type_id === type_id) &&
              (!status_id || promotion.status_id === status_id) &&
              (!discount_id || promotion.discount_id === discount_id) &&
              promotion.code.toLowerCase().includes(searchCode.toLowerCase())
            );
          })}
          pagination={{ pageSize: 10 }}
          search={false}
          options={{ density: true, fullScreen: true }}
          toolBarRender={() => [
            <Input.Search
              placeholder="ค้นหารหัสโปรโมชั่น"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{ width: 200, marginRight: 8 }}
            />,
            <Button
              icon={<FilterOutlined />}
              size="middle"
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{ fontSize: "14px" }}
            >
              ตัวกรอง
            </Button>,
          ]}
        />

        <Drawer
          title="ตัวกรองโปรโมชั่น"
          placement="right"
          width={300}
          onClose={() => setIsFilterDrawerOpen(false)}
          open={isFilterDrawerOpen}
          footer={
            <div style={{ textAlign: "right" }}>
              <Button onClick={() => setFilters({ type_id: null, status_id: null, discount_id: null })} style={{ marginRight: 8 }}>
                รีเซ็ต
              </Button>
              <Button type="primary" onClick={applyFilters}>
                ใช้
              </Button>
            </div>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <span>ประเภท:</span>
            <Select
              placeholder="เลือกประเภท"
              style={{ width: "100%" }}
              allowClear
              value={filters.type_id}
              onChange={(value) => setFilters({ ...filters, type_id: value })}
            >
              {Object.entries(promotionTypes).map(([key, value]) => (
                <Select.Option key={key} value={Number(key)}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span>สถานะ:</span>
            <Select
              placeholder="เลือกสถานะ"
              style={{ width: "100%" }}
              allowClear
              value={filters.status_id}
              onChange={(value) => setFilters({ ...filters, status_id: value })}
            >
              {Object.entries(promotionStatuses).map(([key, value]) => (
                <Select.Option key={key} value={Number(key)}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <span>ประเภทส่วนลด:</span>
            <Select
              placeholder="เลือกประเภทส่วนลด"
              style={{ width: "100%" }}
              allowClear
              value={filters.discount_id}
              onChange={(value) => setFilters({ ...filters, discount_id: value })}
            >
              {Object.entries(promotionDiscounts).map(([key, value]) => (
                <Select.Option key={key} value={Number(key)}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Drawer>

        <Modal
          title="ยืนยันการลบ"
          open={isModalOpen}
          onOk={handleDelete}
          onCancel={() => setIsModalOpen(false)}
          okText="ลบ"
          cancelText="ยกเลิก"
          okButtonProps={{ danger: true }}
        >
          คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่นนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default Promotion;
