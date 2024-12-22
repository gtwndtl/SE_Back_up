import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { GetPromotionById, UpdatePromotionById, GetPromotionType, GetDiscountType, GetPromotionStatus } from "../../../service/htpps/PromotionAPI";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function PromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [promotionTypes, setPromotionTypes] = useState<{ ID: number; type: string }[]>([]);
  const [discountTypes, setDiscountTypes] = useState<{ ID: number; discount_type: string }[]>([]);
  const [statusTypes, setStatusTypes] = useState<{ ID: number; status: string }[]>([]);
  const [selectedDiscountType, setSelectedDiscountType] = useState<number | null>(null); // State สำหรับประเภทส่วนลด
  const [showLimitDiscount, setShowLimitDiscount] = useState(true); // State สำหรับการควบคุมการแสดง limit_discount
  const [form] = Form.useForm();

  const getPromotionById = async (id: string) => {
    let res = await GetPromotionById(id);
    if (res.status === 200) {
      form.setFieldsValue({
        name: res.data.name,
        code: res.data.code,
        details: res.data.details,
        start_date: dayjs(res.data.start_date),
        end_date: dayjs(res.data.end_date),
        limit: res.data.limit,
        count_limit: res.data.count_limit,
        discount: res.data.discount,
        minimum_price: res.data.minimum_price,
        limit_discount: res.data.limit_discount,
        type_id: res.data.type_id,
        discount_id: res.data.discount_id,
        status_id: res.data.status_id,
      });

      setSelectedDiscountType(res.data.discount_id);
      // ตั้งค่า showLimitDiscount ตามค่า discount_id
      setShowLimitDiscount(res.data.discount_id !== 2); // ถ้า discount_id = 2 ให้ซ่อน limit_discount
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      setTimeout(() => {
        navigate("/promotions");
      }, 2000);
    }
  };

  const getPromotionTypes = async () => {
    let res = await GetPromotionType();
    if (res.status === 200) {
      setPromotionTypes(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถโหลดข้อมูลประเภทโปรโมชั่นได้",
      });
    }
  };

  const getDiscountTypes = async () => {
    let res = await GetDiscountType();
    if (res.status === 200) {
      setDiscountTypes(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถโหลดข้อมูลประเภทส่วนลดได้",
      });
    }
  };

  const getStatusTypes = async () => {
    let res = await GetPromotionStatus();
    if (res.status === 200) {
      setStatusTypes(res.data);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่สามารถโหลดข้อมูลประเภทโปรโมชั่นได้",
      });
    }
  };

  const onFinish = async (values: any) => {
    let payload = { ...values,
      discount: parseFloat(values.discount),
      limit_discount: parseFloat(values.limit_discount),
      limit: parseInt(values.limit),
      count_limit: parseInt(values.count_limit),
      minimum_price: parseFloat(values.minimum_price),
     };

    const res = await UpdatePromotionById(id, payload);
    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content:"อัพเดทสำเร็จ!",
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content:"อัพเดทไม่สำเร็จ!",
      });
    }
  };

  useEffect(() => {
    getPromotionTypes();
    getDiscountTypes();
    getStatusTypes();
    getPromotionById(id);
  }, [id]);

  return (
    <div
      style={{
        width: "80%",
        margin: "0 auto",
        backgroundColor: "white",
        border: "1px solid #003366",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
      }}
    >
      {contextHolder}
      <Card
        style={{
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontFamily: "Kanit, sans-serif",
            marginBottom: "20px",
            color: "#003366",
          }}
        >
          แก้ไขข้อมูลโปรโมชั่น
        </h2>
        <Divider />
        <Form
          name="promotion-edit"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label="ชื่อโปรโมชั่น"
                name="name"
                style={{ marginBottom: "16px" }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="รหัสโปรโมชั่น"
                name="code"
                rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="รายละเอียด"
                name="details"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียด!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="วันที่เริ่ม"
                name="start_date"
                rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่ม!" }]}
                style={{ marginBottom: "16px" }}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="วันที่สิ้นสุด"
                name="end_date"
                rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด!" }]}
                style={{ marginBottom: "16px" }}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ประเภทโปรโมชั่น"
                name="type_id"
                rules={[{ required: true, message: "กรุณาเลือกประเภทโปรโมชั่น!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select style={{ width: "100%" }}>
                  {promotionTypes.map((promotion_type) => (
                    <Select.Option key={promotion_type.ID} value={promotion_type.ID}>
                      {promotion_type.type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ประเภทส่วนลด"
                name="discount_id"
                rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select style={{ width: "100%" }} disabled>
                  {discountTypes.map((discount_type) => (
                    <Select.Option key={discount_type.ID} value={discount_type.ID}>
                      {discount_type.discount_type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ส่วนลด"
                name="discount"
                rules={[
                  { required: true, message: "กรุณากรอกส่วนลด!" },
                  {
                    validator: (_, value) => {
                      if (selectedDiscountType === 1) {
                        if (value < 1 || value > 100) {
                          return Promise.reject(new Error("ส่วนลดต้องอยู่ระหว่าง 1 ถึง 100!"));
                        }
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                style={{ marginBottom: "16px" }}
              >
                <InputNumber
                  min={1}
                  addonAfter={selectedDiscountType === 1 ? "%" : "฿"}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ display: showLimitDiscount ? "block" : "none" }}>
              <Form.Item
                label="ส่วนลดสูงสุด"
                name="limit_discount"
                style={{ marginBottom: "16px" }}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="จำนวนสิทธิ์"
                name="limit"
                rules={[{ required: true, message: "กรุณากรอกจำนวนสิทธิ์!" }]}
                style={{ marginBottom: "16px" }}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="จำนวนการใช้"
                name="count_limit"
                rules={[{ required: true, message: "กรุณากรอกจำนวนการใช้!" }]}
                style={{ marginBottom: "16px" }}
              >
                <InputNumber 
                readOnly
                style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ราคาขั้นต่ำ"
                name="minimum_price"
                rules={[{ required: true, message: "กรุณากรอกราคาขั้นต่ำ!" }]}
                style={{ marginBottom: "16px" }}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="สถานะ"
                name="status_id"
                rules={[{ required: true, message: "กรุณาเลือกสถานะ!" }]}
                style={{ marginBottom: "16px" }}
              >
                <Select style={{ width: "100%" }}>
                  {statusTypes.map((status) => (
                    <Select.Option key={status.ID} value={status.ID}>
                      {status.status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#003366",
                  color: "white",
                  borderRadius: "4px",
                }}
              >
                อัพเดท
              </Button>
              <Link to="/promotion">
                <Button
                  style={{
                    backgroundColor: "gray",
                    color: "white",
                    borderRadius: "4px",
                  }}
                >
                  ยกเลิก
                </Button>
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default PromotionEdit;
