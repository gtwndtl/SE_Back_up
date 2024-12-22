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
  InputNumber,
  Spin,
  Typography,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePromotion, GetPromotionType, GetDiscountType } from "../../../service/htpps/PromotionAPI";
import { PromotionTypeInterface } from "../../../interface/Promotion_type";
import { DiscountTypeInterface } from "../../../interface/Discount_type";

const { Title, Text } = Typography;
const { Option } = Select;

function PromotionCreate() {
  const navigate = useNavigate();
  const [promotionTypes, setPromotionTypes] = useState<PromotionTypeInterface[]>([]);
  const [discountTypes, setDiscountTypes] = useState<DiscountTypeInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<PromotionTypeInterface | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionResponse, discountResponse] = await Promise.all([GetPromotionType(), GetDiscountType()]);

        if (promotionResponse.status === 200) {
          setPromotionTypes(promotionResponse.data);
        } else {
          message.error("ไม่สามารถโหลดประเภทโปรโมชั่นได้!");
        }

        if (discountResponse.status === 200) {
          setDiscountTypes(discountResponse.data);
        } else {
          message.error("ไม่สามารถโหลดประเภทส่วนลดได้!");
        }
      } catch (error) {
        message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSelectType = (type: PromotionTypeInterface) => {
    setSelectedType(type);
  };

  const onFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      type_id: selectedType?.ID,
      discount_id: values.discount_id,
      status_id: 1,
      count_limit: 0,
      limit: Number(values.limit),
    };

    try {
      const res = await CreatePromotion(formattedValues);
      if (res.status === 201) {
        messageApi.open({
          type: "success",
          content: "สร้างโปรโมชั่นสำเร็จ!",
        });
        setTimeout(() => {
          navigate("/promotion");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "ไม่สามารถสร้างโปรโมชั่นได้!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการสร้างโปรโมชั่น!",
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {contextHolder}
      <Card
        style={{
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "#f9f9f9",
        }}
      >
        {!selectedType ? (
          <>
            <Title level={3} style={{ textAlign: "center", color: "#003366" }}>
              เลือกประเภทโปรโมชั่น
            </Title>
            <Divider />
            <Row gutter={[16, 16]} justify="center">
              {promotionTypes.map((type) => (
                <Col key={type.ID} xs={24} sm={12} md={8}>
                  <Button
                    block
                    onClick={() => onSelectType(type)}
                    style={{
                      height: "50px",
                      borderRadius: "8px",
                      background: "#003366",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    {type.type}
                  </Button>
                </Col>
              ))}
            </Row>
            <Row justify="center" style={{ marginTop: "20px" }}>
              <Button
                style={{
                  borderRadius: "8px",
                  background: "#f0f0f0",
                  color: "#666",
                  border: "none",
                }}
                onClick={() => navigate("/promotion")}
              >
                ยกเลิก
              </Button>
            </Row>
          </>
        ) : (
          <>
            <Title level={3} style={{ textAlign: "center", color: "#003366" }}>
              เพิ่มข้อมูลโปรโมชั่น - {selectedType.type}
            </Title>
            <Divider />
            <Form
              form={form}
              name="promotion_create"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<Text strong>ชื่อโปรโมชั่น</Text>}
                    name="name"
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<Text strong>รหัสโปรโมชั่น</Text>}
                    name="code"
                    rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น!" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    label={<Text strong>รายละเอียด</Text>}
                    name="details"
                    rules={[{ required: true, message: "กรุณากรอกรายละเอียด!" }]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<Text strong>วันที่เริ่มต้น</Text>}
                    name="start_date"
                    rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มต้น!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<Text strong>วันที่สิ้นสุด</Text>}
                    name="end_date"
                    rules={[{ required: true, message: "กรุณาเลือกวันที่สิ้นสุด!" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label={<Text strong>ประเภทส่วนลด</Text>}
                    name="discount_id"
                    rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด!" }]}
                  >
                    <Select placeholder="เลือกประเภทส่วนลด" style={{ width: "100%" }}>
                      {discountTypes.map((discount) => (
                        <Option key={discount.ID} value={discount.ID}>
                          {discount.discount_type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.discount_id !== currentValues.discount_id}
                >
                  {({ getFieldValue }) => {
                    const isDiscountSelected = !!getFieldValue("discount_id");
                    const selectedDiscountType = discountTypes.find(
                      (d) => d.ID === getFieldValue("discount_id")
                    );

                    return isDiscountSelected ? (
                      <>
                        {selectedDiscountType?.discount_type === "เปอร์เซ็นต์" ? (
                          <>
                            <Col xs={24} sm={24} md={12}>
                              <Form.Item
                                label={<Text strong>ส่วนลด (เปอร์เซ็นต์)</Text>}
                                name="discount"
                                rules={[{ required: true, message: "กรุณากรอกส่วนลด!" }]}
                              >
                                <InputNumber
                                  min={0}
                                  max={100}
                                  addonAfter="%"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12}>
                              <Form.Item
                                label={<Text strong>ส่วนลดสูงสุด</Text>}
                                name="limit_discount"
                                rules={[{ required: true, message: "กรุณากรอกจำนวนส่วนลดสูงสุด!" }]}
                              >
                                <InputNumber
                                  min={0}
                                  addonAfter="฿" 
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                          </>
                        ) : (
                          <Col xs={24} sm={24} md={12}>
                            <Form.Item
                              label={<Text strong>ส่วนลด (จำนวนเงิน)</Text>}
                              name="discount"
                              rules={[{ required: true, message: "กรุณากรอกส่วนลด!" }]}
                            >
                              <InputNumber
                                min={1}
                                addonAfter="฿" 
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} sm={24} md={12}>
                              <Form.Item
                                label={<Text strong>ขั้นต่ำ</Text>}
                                name="minimum_price"
                                rules={[{ required: true, message: "กรุณากรอกขั้นต่ำ!" }]}
                              >
                                <InputNumber
                                  min={1}
                                  addonAfter="฿" 
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                        <Col xs={24} sm={24} md={12}>
                          <Form.Item
                            label={<Text strong>จำนวนสิทธิ์</Text>}
                            name="limit"
                            rules={[{ required: true, message: "กรุณากรอกจำนวนจำกัด!" }]}
                          >
                            <Input
                             type="number"
                             min={1} 
                             style={{ width: "100%" }} 
                             addonAfter="ครั้ง" 
                             />
                          </Form.Item>
                        </Col>
                      </>
                    ) : null;
                  }}
                </Form.Item>
              </Row>
              <Row justify="center" style={{ marginTop: "20px" }}>
                <Space>
                  <Button
                    type="default"
                    style={{
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                    }}
                    onClick={() => navigate("/promotion")}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "#003366",
                      borderRadius: "8px",
                    }}
                  >
                    เพิ่มโปรโมชั่น
                  </Button>
                </Space>
              </Row>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}

export default PromotionCreate;
