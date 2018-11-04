import { Component, Fragment } from 'react';
import { Form, Input, Card, Button, Row, Col, Modal } from 'antd';
import styles from './index.css';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const prices = [
  { key: 'ck_price', name: '定价' },
  { key: 'jd_price', name: '京东价' },
  { key: 'un_price', name: '划线价' },
];

@Form.create()
class Index extends Component {
  state = {
    visible: false,
    groups: [
      { key: 'product', title: '商品成本' },
      { key: 'material', title: '耗材成本' },
      { key: 'logistics', title: '物流成本' },
      { key: 'advertise', title: '营销成本' },
    ],
    currentGroup: {},
    product: [],
    material: [
      { name: '泡沫箱', price: 9, count: 1 },
      { name: '干冰', price: 2, count: 5 },
    ],
    logistics: [
      { name: '顺丰陆运', price: 40, count: 1 },
    ],
    advertise: [
      { name: '营销预算', price: 9, count: 1 },
    ],
  };

  calculate = () => {
    const cost = { total: 0 };
    this.state.groups.forEach(({ key }) => {
      const group = this.state[key];
      cost[key] = cost[key] || { total: 0 };
      group.forEach(item => {
        console.log(item);
        cost.total += item.price * item.count;
        cost[key].total += item.price * item.count;
      });
    });
    console.log(cost);
    return cost;
  };

  addItem = currentGroup => {
    this.setState({
      currentGroup,
      visible: true
    });
  };

  handleOk = () => {
    this.props.form.validateFields((errors, { price, name, count }) => {
      const { currentGroup } = this.state;
      const group = [ ...this.state[currentGroup.key] ];
      group.push({ price, name, count });
      this.setState({
        visible: false,
        [currentGroup.key]: group,
        price: undefined,
        count: undefined,
        name: undefined

      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { groups, visible, currentGroup } = this.state;
    const cost = this.calculate();

    return (
      <div className={styles.normal}>
        <Row gutter={24}>
          <Col span={16}>
            <Card title={'成本列表'} bordered>
              <Form>
                {groups.map(group => {
                  const items = this.state[group.key];
                  return (
                    <div key={group.key} className={styles.section}>
                      <Row className={styles.sectionTitle}>
                        <Col span={18}><h3>{group.title}</h3></Col>
                        <Col span={6} className={styles.sectionTitleExtra}>
                          <Button onClick={() => { this.addItem(group); }}>添加</Button>
                        </Col>
                      </Row>
                      {items.map((item, key) => (
                        <Row key={key}>
                          <Col span={12}>
                            <FormItem label={item.name} {...formLayout}>
                              {getFieldDecorator(item.name, {
                                initialValue: item.price
                              })(
                                <Input addonAfter={item.name === '营销预算' ? '%' : '元'}/>
                              )}
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem label={'数量'} {...formLayout}>
                              {getFieldDecorator(item.name+'count', {
                                initialValue: item.count
                              })(
                                <Input/>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  );
                })}
              </Form>
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered title={"定品定价"}>
              <Row className={styles.section}>
                <Col span={18}>定价</Col>
                <Col span={6}>利润率</Col>
              </Row>
              {prices.map(price => (
                <Row key={price.key}>
                  <Col span={18}>
                    <FormItem {...formLayout} label={price.name}>
                      {getFieldDecorator(price.key)(
                        <Input addonAfter={'元'}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>0%</Col>
                </Row>
              ))}
              <Row className={styles.section}>
                <Row className={styles.sectionTitle}>
                  <Col span={6}>成本项</Col>
                  <Col span={6}>小计(元)</Col>
                  <Col span={6}>成本占比</Col>
                  <Col span={6}>销售占比</Col>
                </Row>
                {groups.map(group => {
                  const result = cost[group.key];
                  return (
                    <Row key={group.key}>
                      <Col span={6}>{group.title}</Col>
                      <Col span={6}>{result.total}</Col>
                      <Col span={6}>{(result.total / cost.total * 100).toFixed(2)}%</Col>
                      <Col span={6}>{(result.total / cost.total * 100).toFixed(2)}%</Col>
                    </Row>
                  );
                })}
                <Row className={styles.totalCost}>
                  <Col span={6}>总计</Col>
                  <Col span={6}>{cost.total}</Col>
                  <Col span={6}>100%</Col>
                  <Col span={6}>0%</Col>
                </Row>
              </Row>
            </Card>
          </Col>
        </Row>
        <Modal
          title={`添加${currentGroup.title}`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: false })}
        >
          <FormItem {...formLayout} label={'名称'}>
            {getFieldDecorator('name')(<Input/>)}
          </FormItem>
          <FormItem {...formLayout} label={'单价'}>
            {getFieldDecorator('price')(<Input/>)}
          </FormItem>
          <FormItem {...formLayout} label={'数量'}>
            {getFieldDecorator('count')(<Input/>)}
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default Index;
